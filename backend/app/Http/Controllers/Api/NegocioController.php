<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Negocio;

class NegocioController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
    
        $negocios = Negocio::with('user') // carga el usuario relacionado
            ->when($search, function ($query, $search) {
                $query->where('nombre', 'like', "%{$search}%")
                    ->orWhere('descripcion', 'like', "%{$search}%")
                    ->orWhere('direccion', 'like', "%{$search}%");
            })
            ->get();
    
        return response()->json($negocios);
    }
    

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'direccion' => 'nullable|string',
            'servicio_domicilio' => 'boolean',
            'estado' => 'required|in:inactivo,vencido,pagado',
            'fecha_pago' => 'nullable|date', 
            'fecha_vencimiento' => 'nullable|date'
        ]);

        $negocio = Negocio::create($request->all());

        return response()->json(['mensaje' => 'Negocio creado', 'negocio' => $negocio], 201);
    }

    public function update(Request $request, $id)
    {
        $negocio = Negocio::findOrFail($id);

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'direccion' => 'nullable|string',
            'servicio_domicilio' => 'boolean',
            'estado' => 'required|in:inactivo,vencido,pagado',
            'fecha_pago' => 'nullable|date',
            'fecha_vencimiento' => 'nullable|date'
        ]);

        $negocio->update($request->all());

        return response()->json(['mensaje' => 'Negocio actualizado', 'negocio' => $negocio]);
    }

    public function destroy($id)
    {
        $negocio = Negocio::findOrFail($id);
        $negocio->delete();

        return response()->json(['mensaje' => 'Negocio eliminado']);
    }

    public function show($id)
    {
        $negocio = Negocio::findOrFail($id);
        return response()->json($negocio);
    }
}
