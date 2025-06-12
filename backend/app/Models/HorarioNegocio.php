<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HorarioNegocio extends Model
{
    use HasFactory;

    protected $table = 'horarios_negocio'; // pon aquí tu tabla real

    protected $fillable = [
        'negocio_id',
        'cumple_con_horario',
        'abierto',
        'dia_semana',
        'hora_apertura',
        'hora_cierre',
        'cerrado',
    ];

    public function negocio(): BelongsTo
    {
        return $this->belongsTo(Negocio::class);
    }
}
