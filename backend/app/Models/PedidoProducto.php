<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PedidoProducto extends Model
{
    use HasFactory;

    protected $fillable = [
        'pedido_negocio_id', 'producto_id', 'cantidad', 'precio_unitario'
    ];

    public function pedidoNegocio()
    {
        return $this->belongsTo(PedidoNegocio::class);
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }
}

