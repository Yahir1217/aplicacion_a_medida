<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Direccion;
use App\Models\User;
use App\Models\Negocio;

class DireccionController extends Controller
{
    public function crearDireccion(Request $request, $userId)
    {
        $request->validate([
            'titulo' => 'nullable|string|max:255',
            'referencia' => 'required|string',
            'latitud' => 'required|numeric',
            'longitud' => 'required|numeric',
        ]);
    
        $usuario = User::findOrFail($userId);
    
        $direccion = Direccion::create([
            'user_id' => $usuario->id,
            'titulo' => $request->titulo,
            'referencia' => $request->referencia,
            'latitud' => $request->latitud,
            'longitud' => $request->longitud,
        ]);
    
        return response()->json(['mensaje' => 'Dirección creada', 'direccion' => $direccion], 201);
    }
    
    public function actualizarDireccion(Request $request, $userId, $direccionId)
    {
        $request->validate([
            'titulo' => 'nullable|string|max:255',
            'referencia' => 'required|string',
            'latitud' => 'required|numeric',
            'longitud' => 'required|numeric',
        ]);
    
        $usuario = User::findOrFail($userId);
        $direccion = Direccion::where('user_id', $usuario->id)->where('id', $direccionId)->firstOrFail();
    
        $direccion->update([
            'titulo' => $request->titulo,
            'referencia' => $request->referencia,
            'latitud' => $request->latitud,
            'longitud' => $request->longitud,
        ]);
    
        return response()->json(['mensaje' => 'Dirección actualizada', 'direccion' => $direccion], 200);
    }

    public function crearDireccionNegocio(Request $request, $negocioId)
{
    $request->validate([
        'titulo' => 'nullable|string|max:255',
        'referencia' => 'required|string',
        'latitud' => 'required|numeric',
        'longitud' => 'required|numeric',
    ]);

    $negocio = Negocio::findOrFail($negocioId);

    // Verifica si ya tiene una dirección (si solo se permite una)
    if ($negocio->direcciones()->exists()) {
        return response()->json(['mensaje' => 'Este negocio ya tiene una dirección.'], 400);
    }

    $direccion = $negocio->direcciones()->create([
        'titulo' => $request->titulo,
        'referencia' => $request->referencia,
        'latitud' => $request->latitud,
        'longitud' => $request->longitud,
    ]);

    return response()->json(['mensaje' => 'Dirección creada', 'direccion' => $direccion], 201);
}

public function actualizarDireccionNegocio(Request $request, $negocioId, $direccionId)
{
    $request->validate([
        'titulo' => 'nullable|string|max:255',
        'referencia' => 'required|string',
        'latitud' => 'required|numeric',
        'longitud' => 'required|numeric',
    ]);

    $negocio = Negocio::findOrFail($negocioId);
    $direccion = $negocio->direcciones()->where('id', $direccionId)->firstOrFail();

    $direccion->update([
        'titulo' => $request->titulo,
        'referencia' => $request->referencia,
        'latitud' => $request->latitud,
        'longitud' => $request->longitud,
    ]);

    return response()->json(['mensaje' => 'Dirección actualizada', 'direccion' => $direccion], 200);
}

    
    
}

