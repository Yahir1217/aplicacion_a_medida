<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NegocioTelefono extends Model
{
    use HasFactory;

    protected $table = 'negocio_telefonos';  // nombre de la tabla

    protected $fillable = [
        'negocio_id',
        'telefono',
    ];

    /**
     * Relación: un teléfono pertenece a un negocio.
     */
    public function negocio(): BelongsTo
    {
        return $this->belongsTo(Negocio::class);
    }
}
