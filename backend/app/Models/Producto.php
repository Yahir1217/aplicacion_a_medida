<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Producto extends Model
{
    use HasFactory;

    protected $fillable = [
        'negocio_id',
        'nombre',
        'descripcion',
        'foto',
        'precio',
        'stock',
        'publicado',
    ];

    /**
     * Relación: Un producto pertenece a un negocio.
     */
    public function negocio(): BelongsTo
    {
        return $this->belongsTo(Negocio::class);
    }
    public function carrito()
    {
        return $this->hasMany(CarritoProducto::class);
    }
}

