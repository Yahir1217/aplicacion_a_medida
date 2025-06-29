<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'direccion_id', 'metodo_pago', 'tarjeta_last4', 'tarjeta_brand',
        'subtotal', 'comision_servicio', 'total', 'estado'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function direccion()
    {
        return $this->belongsTo(Direccion::class);
    }

    public function pedidoNegocios()
    {
        return $this->hasMany(PedidoNegocio::class);
    }
}

