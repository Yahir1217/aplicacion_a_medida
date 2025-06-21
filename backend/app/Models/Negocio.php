<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Negocio extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nombre',
        'logo_url',
        'descripcion',
        'direccion',
        'servicio_domicilio',
        'estado',
        'fecha_pago',
        'fecha_vencimiento',
    ];

    /**
     * Relación: Un negocio pertenece a un usuario.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function redesSociales()
    {
        return $this->hasMany(NegocioRedSocial::class);
    }

    public function categorias()
    {
        return $this->belongsToMany(Categoria::class, 'categoria_negocio');
    }

    public function correos()
    {
        return $this->hasMany(NegocioCorreo::class);
    }

    public function telefonos()
    {
        return $this->hasMany(NegocioTelefono::class);
    }

    public function horarios()
    {
        return $this->hasMany(HorarioNegocio::class);
    }

    public function publicaciones()
    {
        return $this->hasMany(Publicacion::class);
    }

    public function productos()
    {
        return $this->hasMany(Producto::class);
    }

}
