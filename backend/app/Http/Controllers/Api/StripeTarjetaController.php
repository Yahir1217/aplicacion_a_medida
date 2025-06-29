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
use Stripe\Account;
use Illuminate\Support\Facades\Log;


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
            Log::info('Inicio store tarjeta', ['tipo' => $request->tipo]);
    
            if ($request->tipo === 'cliente') {
                $owner = Auth::user();
                $email = $owner->email;
            } else {
                $owner = \App\Models\Negocio::with('correos', 'user')->findOrFail($request->negocio_id);
                $email = $owner->correos->first()->correo ?? $owner->user->email ?? 'sin-email@ejemplo.com';
            }
    
            // Crear cliente en Stripe si no existe
            $stripeCustomer = StripeCustomer::firstOrCreate(
                [
                    'stripe_customerable_id' => $owner->id,
                    'stripe_customerable_type' => get_class($owner),
                ],
                [
                    'stripe_customer_id' => Customer::create(['email' => $email])->id,
                ]
            );
            Log::info('StripeCustomer encontrado o creado', ['stripe_customer_id' => $stripeCustomer->stripe_customer_id]);
    
            $paymentMethod = PaymentMethod::retrieve($request->payment_method_id);
    
            // Si es negocio
            if ($request->tipo === 'negocio') {
                if ($stripeCustomer->default_payment_method) {
                    Log::warning('Negocio ya tiene método de pago predeterminado', ['negocio_id' => $owner->id]);
                    return response()->json([
                        'error' => 'El negocio ya tiene una tarjeta registrada.'
                    ], 400);
                }
    
                // Adjuntar método de pago
                $paymentMethod->attach(['customer' => $stripeCustomer->stripe_customer_id]);
                Log::info('PaymentMethod adjuntado al cliente', ['payment_method_id' => $request->payment_method_id]);
    
                $stripeCustomer->default_payment_method = $request->payment_method_id;
    
                // Crear cuenta conectada si no existe
                if (empty($stripeCustomer->stripe_account_id)) {
                    $account = Account::create([
                        'type' => 'express',
                        'country' => 'MX',
                        'email' => $email,
                        'capabilities' => [
                            'transfers' => ['requested' => true],
                        ],
                    ]);
                    $stripeCustomer->stripe_account_id = $account->id;
                    Log::info('Cuenta Stripe Connect creada', ['stripe_account_id' => $account->id]);
    
                    // Generar link de onboarding
                    $accountLink = AccountLink::create([
                        'account' => $account->id,
                        'refresh_url' => url('/stripe/reauth'),
                        'return_url' => url('/stripe/success'),
                        'type' => 'account_onboarding',
                    ]);
                    Log::info('Link de onboarding creado', ['url' => $accountLink->url]);
    
                    $stripeCustomer->save();
    
                    // Actualizar método predeterminado en Stripe
                    Customer::update($stripeCustomer->stripe_customer_id, [
                        'invoice_settings' => [
                            'default_payment_method' => $request->payment_method_id
                        ]
                    ]);
    
                    return response()->json([
                        'success' => true,
                        'message' => 'Tarjeta registrada. Falta que el negocio complete el onboarding.',
                        'onboarding_url' => $accountLink->url,
                        'stripe_account_id' => $stripeCustomer->stripe_account_id
                    ]);
                }
    
                $stripeCustomer->save();
    
                // Actualizar método predeterminado en Stripe
                Customer::update($stripeCustomer->stripe_customer_id, [
                    'invoice_settings' => [
                        'default_payment_method' => $request->payment_method_id
                    ]
                ]);
    
                return response()->json([
                    'success' => true,
                    'message' => 'Tarjeta registrada y cuenta Stripe ya existe.',
                    'stripe_account_id' => $stripeCustomer->stripe_account_id
                ]);
            }
    
            // Si es cliente
            if ($request->tipo === 'cliente') {
                $paymentMethod->attach(['customer' => $stripeCustomer->stripe_customer_id]);
    
                $tarjetas = PaymentMethod::all([
                    'customer' => $stripeCustomer->stripe_customer_id,
                    'type' => 'card'
                ]);
    
                return response()->json([
                    'success' => true,
                    'message' => 'Tarjeta agregada para el cliente.',
                    'tarjetas' => $tarjetas->data
                ]);
            }
    
            return response()->json(['error' => 'Tipo inválido.'], 400);
    
        } catch (\Exception $e) {
            Log::error('Error en store tarjeta', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
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

    public function generarOnboardingLink($id)
{
    try {
        Stripe::setApiKey(config('services.stripe.secret'));

        $negocio = \App\Models\Negocio::findOrFail($id);
        $stripeCustomer = StripeCustomer::where([
            'stripe_customerable_id' => $negocio->id,
            'stripe_customerable_type' => get_class($negocio),
        ])->firstOrFail();

        if (!$stripeCustomer->stripe_account_id) {
            return response()->json(['error' => 'El negocio no tiene cuenta Stripe conectada.'], 400);
        }

        $accountLink = \Stripe\AccountLink::create([
            'account' => $stripeCustomer->stripe_account_id,
            'refresh_url' => url('/stripe/reauth'),
            'return_url' => url('/stripe/success'),
            'type' => 'account_onboarding',
        ]);

        return response()->json(['url' => $accountLink->url]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Error al generar onboarding link.',
            'detalle' => $e->getMessage()
        ], 500);
    }
}

}
