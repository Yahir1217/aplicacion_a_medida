<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Role;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $query = Role::where('id', '!=', 1);
    
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where('nombre', 'like', "%{$search}%");
        }
    
        $roles = $query->get();
    
        return response()->json($roles);
    }     

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string'
        ]);

        $role = Role::create($request->all());

        return response()->json($role, 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string'
        ]);

        $role = Role::findOrFail($id);
        $role->update($request->all());

        return response()->json($role);
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return response()->json(['message' => 'Rol eliminado correctamente']);
    }
}
