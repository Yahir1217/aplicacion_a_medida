<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportePublicacion extends Model
{
    use HasFactory;

    protected $table = 'reportes_publicaciones';

    protected $fillable = [
        'user_id',
        'publicacion_id',
        'comentario',
        'visto', 
    ];

    // Relaciones

    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function publicacion()
    {
        return $this->belongsTo(Publicacion::class, 'publicacion_id');
    }
}
