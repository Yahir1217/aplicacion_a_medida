<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Publicacion extends Model
{
    use HasFactory;

    protected $fillable = [
        'negocio_id',
        'descripcion',
        'pdf',
    ];

    public function negocio(): BelongsTo
    {
        return $this->belongsTo(Negocio::class);
    }

    public function imagenes()
    {
        return $this->hasMany(ImagenPublicacion::class);
    }

    public function categorias()
    {
        return $this->belongsToMany(Categoria::class, 'categoria_publicacion');
    }

}
