<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Producto;
use App\Models\CarritoProducto;
use App\Models\User;

use Illuminate\Support\Facades\Auth;
use App\Models\StripeCustomer;
use Stripe\Stripe;
use Stripe\PaymentMethod;




class CarritoProductoController extends Controller
{

    public function index()
    {
        $user = Auth::user();
    
        // Traer usuario con sus direcciones
        $usuario = User::with(['direcciones:id,user_id,titulo,referencia,latitud,longitud'])
            ->select('id', 'name', 'telefono', 'foto_perfil')
            ->find($user->id);
    
        // Obtener StripeCustomer relacionado
        $stripeCustomer = StripeCustomer::where([
            'stripe_customerable_id' => $usuario->id,
            'stripe_customerable_type' => User::class,
        ])->first();
    
        $tarjetas = [];
    
        if ($stripeCustomer) {
            try {
                Stripe::setApiKey(config('services.stripe.secret'));
    
                $paymentMethods = PaymentMethod::all([
                    'customer' => $stripeCustomer->stripe_customer_id,
                    'type' => 'card'
                ]);
    
                $tarjetas = $paymentMethods->data;
            } catch (\Exception $e) {
                // Si hay error, puedes loguearlo si deseas
                \Log::error('Error obteniendo tarjetas Stripe: ' . $e->getMessage());
            }
        }
    
        // Adjuntar tarjetas al usuario manualmente
        $usuario->tarjetas = $tarjetas;
    
        // Carrito con producto, negocio y direcciones
        $carrito = CarritoProducto::with([
            'producto.negocio.direcciones:id,negocio_id,titulo,referencia,latitud,longitud'
        ])
        ->where('user_id', $user->id)
        ->get();
    
        return response()->json([
            'usuario' => $usuario,
            'carrito' => $carrito,
        ]);
    }
    


    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'producto_id' => 'required|exists:productos,id',
            'cantidad' => 'required|integer|min:1',
        ]);
    
        $producto = Producto::findOrFail($request->producto_id);
    
        $carritoExistente = CarritoProducto::where('user_id', $request->user_id)
            ->where('producto_id', $request->producto_id)
            ->where('estado', 'pendiente')
            ->first();
    
        if ($carritoExistente) {
            $nuevaCantidad = $carritoExistente->cantidad + $request->cantidad;
    
            if ($nuevaCantidad > $producto->stock) {
                return response()->json(['message' => 'No hay suficiente stock disponible'], 422);
            }
    
            $carritoExistente->cantidad = $nuevaCantidad;
            $carritoExistente->save();
    
            return response()->json($carritoExistente, 200);
        }
    
        if ($request->cantidad > $producto->stock) {
            return response()->json(['message' => 'No hay suficiente stock disponible'], 422);
        }
    
        $carrito = CarritoProducto::create([
            'user_id' => $request->user_id,
            'producto_id' => $request->producto_id,
            'cantidad' => $request->cantidad,
            'estado' => 'pendiente',
        ]);
    
        return response()->json($carrito, 201);
    }

    public function update(Request $request, $id)
    {
        $carrito = CarritoProducto::findOrFail($id);
        $producto = Producto::findOrFail($carrito->producto_id);

        $request->validate([
            'cantidad' => 'required|integer|min:1',
        ]);

        if ($request->cantidad > $producto->stock) {
            return response()->json(['message' => 'No hay suficiente stock disponible'], 422);
        }

        $carrito->cantidad = $request->cantidad;
        $carrito->save();

        return response()->json($carrito);
    }

    public function destroy($id)
    {
        $carrito = CarritoProducto::findOrFail($id);
        $carrito->delete();

        return response()->json(['message' => 'Producto eliminado del carrito']);
    }

    
    

}
