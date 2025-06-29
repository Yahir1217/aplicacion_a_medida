<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pedido;
use App\Models\PedidoNegocio;
use App\Models\PedidoProducto;
use App\Models\User;
use App\Models\Negocio;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Transfer;
use Illuminate\Support\Facades\Log;


class CompraController extends Controller
{
    public function guardarCompra(Request $request)
    {
        Log::info('Inicio guardarCompra', ['request' => $request->all()]);
    
        try {
            Stripe::setApiKey(env('STRIPE_SECRET'));
    
            // Buscar usuario
            $user = User::findOrFail($request->user_id);
            Log::info('Usuario encontrado', ['user_id' => $user->id]);
    
            // Validar StripeCustomer del usuario si el método de pago es tarjeta
            if ($request->metodo_pago === 'tarjeta' && !$user->stripeCustomer) {
                Log::error('Usuario no tiene StripeCustomer');
                return response()->json(['success' => false, 'message' => 'Usuario no tiene cuenta Stripe configurada'], 400);
            }
    
            // Variable para guardar el payment_intent_id (si aplica)
            $payment_intent_id = null;
    
            // Si el pago es con tarjeta, crear PaymentIntent
            if ($request->metodo_pago === 'tarjeta') {
                Log::info('Creando PaymentIntent para tarjeta');
                $paymentIntent = PaymentIntent::create([
                    'amount' => intval($request->total * 100), // en centavos
                    'currency' => 'mxn',
                    'customer' => $user->stripeCustomer->stripe_customer_id,
                    'payment_method' => $request->tarjeta_id,
                    'capture_method' => 'manual', // autoriza, no cobra
                    'confirm' => true,
                    'off_session' => true,
                ]);
                Log::info('PaymentIntent creado', ['payment_intent_id' => $paymentIntent->id]);
                $payment_intent_id = $paymentIntent->id;
            }
    
            // Crear pedido general (siempre)
            $pedido = Pedido::create([
                'user_id' => $user->id,
                'direccion_id' => $request->direccion_id,
                'metodo_pago' => $request->metodo_pago,
                'tarjeta_id' => $request->tarjeta_id,
                'subtotal' => $request->subtotal,
                'comision' => $request->comision,
                'total' => $request->total,
                'estado' => 'pendiente',
                'payment_intent_id' => $payment_intent_id,
            ]);
            Log::info('Pedido creado', ['pedido_id' => $pedido->id]);
    
            // Recorrer negocios
            foreach ($request->negocios as $n) {
                $negocio = Negocio::findOrFail($n['negocio_id']);
                Log::info('Procesando negocio', ['negocio_id' => $negocio->id]);
    
                // Calcular total del negocio
                $totalNegocio = 0;
                foreach ($n['productos'] as $p) {
                    $totalNegocio += $p['precio_unitario'] * $p['cantidad'];
                }
                Log::info('Total negocio calculado', ['total_negocio' => $totalNegocio]);
    
                // Calcular comisión
                $comision = round($totalNegocio * 0.029 + 3, 2);
                $neto = $totalNegocio - $comision;
                Log::info('Comisión calculada', ['comision' => $comision, 'neto' => $neto]);
    
                // Crear PedidoNegocio
                $pedidoNegocio = PedidoNegocio::create([
                    'pedido_id' => $pedido->id,
                    'negocio_id' => $negocio->id,
                    'tipo_entrega' => $n['tipo_entrega'],
                    'comentario' => $n['comentario'] ?? null,
                    'total_negocio' => $neto,
                    'publico' => $negocio->servicio_domicilio ? false : true,
                    'estado' => 'pendiente',
                ]);
                Log::info('PedidoNegocio creado', ['pedido_negocio_id' => $pedidoNegocio->id]);
    
                // Crear productos
                foreach ($n['productos'] as $p) {
                    PedidoProducto::create([
                        'pedido_negocio_id' => $pedidoNegocio->id,
                        'producto_id' => $p['producto_id'],
                        'cantidad' => $p['cantidad'],
                        'precio_unitario' => $p['precio_unitario'],
                    ]);
                }
            }
    
            return response()->json([
                'success' => true,
                'pedido_id' => $pedido->id,
                'payment_intent_id' => $payment_intent_id,
                'message' => $request->metodo_pago === 'tarjeta' 
                    ? 'Pago autorizado, pendiente de captura'
                    : 'Pedido creado con pago en efectivo'
            ]);
        } catch (\Exception $e) {
            Log::error('Error en guardarCompra', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al guardar la compra',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function ordenes($id)
    {
        $ordenes = PedidoNegocio::with([
            'pedido.user:id,name,telefono,foto_perfil',
            'pedido.direccion:id,referencia,latitud,longitud',
            'pedido:id,user_id,direccion_id,metodo_pago',
            'productos.producto:id,nombre,foto',
            'negocio.direcciones:id,negocio_id,latitud,longitud' 

        ])
        ->where('negocio_id', $id)
        ->orderByDesc('created_at')
        ->get();
    
        return response()->json($ordenes);
    }
    
    
    
}
