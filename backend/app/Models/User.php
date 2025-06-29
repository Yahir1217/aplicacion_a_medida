<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'telefono',
        'password',
        'foto_perfil',
        'visible',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [];
    }

    public function pedidos()
    {
        return $this->hasMany(Pedido::class);
    }

    public function negocios(): HasMany
    {
        return $this->hasMany(Negocio::class);
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_role', 'user_id', 'role_id');
    }

    public function reportesPublicaciones()
    {
        return $this->hasMany(ReportePublicacion::class);
    }

    public function publicaciones()
    {
        return $this->hasMany(Publicacion::class);
    }
    public function carrito()
    {
        return $this->hasMany(CarritoProducto::class);
    }
    public function stripeCustomer()
    {
        return $this->morphOne(StripeCustomer::class, 'stripe_customerable');
    }
    
         
    public function direcciones()
    {
        return $this->hasMany(Direccion::class);
    }

}
