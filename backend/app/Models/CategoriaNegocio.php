<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CategoriaNegocio extends Model
{
    use HasFactory;

    protected $table = 'categoria_negocio';

    protected $fillable = [
        'negocio_id',
        'categoria_id',
    ];

    /**
     * Relación: esta asignación pertenece a un negocio.
     */
    public function negocio(): BelongsTo
    {
        return $this->belongsTo(Negocio::class);
    }

    /**
     * Relación: esta asignación pertenece a una categoría.
     */
    public function categoria(): BelongsTo
    {
        return $this->belongsTo(Categoria::class);
    }
}
