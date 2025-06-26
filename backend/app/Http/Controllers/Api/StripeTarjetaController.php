<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StripeCustomer;
use App\Models\Negocio;
use Stripe\Stripe;
use Stripe\Customer;
use Stripe\PaymentMethod;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class StripeTarjetaController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'payment_method_id' => 'required|string',
            'tipo' => 'required|in:cliente,negocio',
            'negocio_id' => 'nullable|exists:negocios,id',
        ]);
    
        try {
            Stripe::setApiKey(config('services.stripe.secret'));
    
            if ($request->tipo === 'cliente') {
                $owner = Auth::user();
                $email = $owner->email;
            } else {
                $owner = Negocio::with('correos', 'user')->findOrFail($request->negocio_id);
                $email = $owner->correos->first()->correo ?? $owner->user->email ?? 'sin-email@ejemplo.com';
            }
    
            // Obtener o crear cliente en Stripe
            $stripeCustomer = StripeCustomer::firstOrCreate(
                [
                    'stripe_customerable_id' => $owner->id,
                    'stripe_customerable_type' => get_class($owner),
                ],
                [
                    'stripe_customer_id' => Customer::create([
                        'email' => $email
                    ])->id,
                ]
            );
    
            $paymentMethod = PaymentMethod::retrieve($request->payment_method_id);
    
            // Validar para negocio si ya tiene método de pago predeterminado
            if ($request->tipo === 'negocio') {
                if ($stripeCustomer->default_payment_method) {
                    return response()->json([
                        'error' => 'El negocio ya tiene una tarjeta registrada.'
                    ], 400);
                }
    
                // Adjuntar método y actualizar predeterminado
                $paymentMethod->attach(['customer' => $stripeCustomer->stripe_customer_id]);
    
                $stripeCustomer->default_payment_method = $request->payment_method_id;
                $stripeCustomer->save();
    
                Customer::update($stripeCustomer->stripe_customer_id, [
                    'invoice_settings' => [
                        'default_payment_method' => $request->payment_method_id
                    ]
                ]);
    
                return response()->json([
                    'message' => 'Tarjeta registrada como método predeterminado del negocio.'
                ]);
            }
    
            // Si es cliente, puede tener muchas tarjetas
            if ($request->tipo === 'cliente') {
                $paymentMethod->attach(['customer' => $stripeCustomer->stripe_customer_id]);
    
                $tarjetas = PaymentMethod::all([
                    'customer' => $stripeCustomer->stripe_customer_id,
                    'type' => 'card'
                ]);
    
                return response()->json([
                    'message' => 'Tarjeta agregada para el cliente.',
                    'tarjetas' => $tarjetas->data
                ]);
            }
    
            return response()->json(['error' => 'Tipo inválido.'], 400);
    
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrió un error al registrar la tarjeta.',
                'detalle' => $e->getMessage()
            ], 500);
        }
    }
    

    public function obtenerTarjetas(Request $request)
    {
        $request->validate([
            'tipo' => 'required|in:cliente,negocio',
            'negocio_id' => 'nullable|exists:negocios,id',
        ]);

        Stripe::setApiKey(config('services.stripe.secret'));

        // Determinar el dueño
        if ($request->tipo === 'cliente') {
            $owner = Auth::user();
        } else {
            $owner = Negocio::findOrFail($request->negocio_id);
        }

        // Buscar el stripe_customer
        $stripeCustomer = StripeCustomer::where([
            'stripe_customerable_id' => $owner->id,
            'stripe_customerable_type' => get_class($owner),
        ])->first();

        if (!$stripeCustomer) {
            return response()->json(['tarjetas' => []]);
        }

        // Obtener tarjetas del cliente de Stripe
        try {
            $paymentMethods = PaymentMethod::all([
                'customer' => $stripeCustomer->stripe_customer_id,
                'type' => 'card'
            ]);

            return response()->json(['tarjetas' => $paymentMethods->data]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener las tarjetas.',
                'detalle' => $e->getMessage()
            ], 500);
        }
    }
}
