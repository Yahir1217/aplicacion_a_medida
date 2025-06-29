<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StripeCustomer extends Model
{
    use HasFactory;

    protected $fillable = [
        'stripe_customerable_id',
        'stripe_customerable_type',
        'stripe_customer_id',
        'stripe_account_id',         // <-- Añadido aquí
        'default_payment_method',
    ];

    public function stripeCustomerable()
    {
        return $this->morphTo();
    }
}

