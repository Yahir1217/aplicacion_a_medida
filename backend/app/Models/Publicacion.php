<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Publicacion extends Model
{
    use HasFactory;

    protected $table = 'publicaciones';

    protected $fillable = [
        'negocio_id',
        'user_id', // agregado aquí
        'descripcion',
        'pdf',
        'destacado',
        'orden'
    ];

    public function negocio(): BelongsTo
    {
        return $this->belongsTo(Negocio::class);
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function imagenes()
    {
        return $this->hasMany(ImagenPublicacion::class);
    }

    public function categorias()
    {
        return $this->belongsToMany(Categoria::class, 'categoria_publicacion');
    }

    public function reportes()
    {
        return $this->hasMany(ReportePublicacion::class, 'publicacion_id');
    }
}
