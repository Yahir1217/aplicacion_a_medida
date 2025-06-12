<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistoriaNegocio extends Model
{
    use HasFactory;

    protected $fillable = [
        'negocio_id',
        'titulo',
    ];

    public function negocio(): BelongsTo
    {
        return $this->belongsTo(Negocio::class);
    }

    public function imagenes()
    {
        return $this->hasMany(HistoriaImagen::class);
    }

}
