<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UsuarioController extends Controller
{

    /**
     * Obtiene el nombre y correo electrónico de un usuario específico.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function obtenerUsuario($id)
    {
        $usuario = User::find($id);

        if (!$usuario) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        return response()->json([
            'name' => $usuario->name,
            'email' => $usuario->email
        ]);
    }
}
