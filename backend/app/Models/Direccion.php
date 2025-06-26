<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Direccion extends Model
{
    use HasFactory;

    protected $table = 'direcciones'; 
    
    protected $fillable = [
        'user_id',
        'negocio_id',
        'titulo',
        'referencia',
        'latitud',
        'longitud',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function negocio()
    {
        return $this->belongsTo(Negocio::class);
    }
}
