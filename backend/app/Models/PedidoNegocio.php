<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PedidoNegocio extends Model
{
    use HasFactory;

    protected $fillable = [
        'pedido_id', 'negocio_id', 'tipo_entrega', 'total_negocio', 'publico', 'comentario', 'estado'
    ];

    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }

    public function negocio()
    {
        return $this->belongsTo(Negocio::class);
    }

    public function productos()
    {
        return $this->hasMany(PedidoProducto::class);
    }
}

