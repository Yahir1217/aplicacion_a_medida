<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistoriaImagen extends Model
{
    use HasFactory;

    protected $fillable = [
        'historia_id',
        'url_imagen',
        'orden',
    ];

    public function historia(): BelongsTo
    {
        return $this->belongsTo(HistoriaNegocio::class);
    }
}
