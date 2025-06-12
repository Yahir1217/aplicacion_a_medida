<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NegocioRedSocial extends Model
{
    use HasFactory;

    protected $table = 'negocio_redes_sociales'; // pon aquí tu tabla real

    protected $fillable = [
        'negocio_id',
        'tipo',
        'url',
    ];

    public function negocio(): BelongsTo
    {
        return $this->belongsTo(Negocio::class);
    }
}
