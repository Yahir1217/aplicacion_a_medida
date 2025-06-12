<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Services\GoogleDriveService;
use Illuminate\Support\Facades\Storage;


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
            'email' => $usuario->email,
            'foto_perfil' => $usuario->foto_perfil

        ]);
    }

    public function index(Request $request)
    {
        $filtro = $request->query('filtro');
    
        $usuarios = User::with('roles')
            ->when($filtro, function ($query, $filtro) {
                $query->where(function ($q) use ($filtro) {
                    $q->where('name', 'like', "%{$filtro}%")
                      ->orWhere('email', 'like', "%{$filtro}%");
                });
            })
            ->where('id', '!=', 1) // excluir el usuario con id 1
            ->get()
            ->map(function ($user) {
                $user->role_nombre = $user->roles->first()?->nombre ?? 'Sin rol';
                return $user;
            });
    
        return response()->json($usuarios);
    }
    
    

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role_id' => 'required|exists:roles,id'
        ]);
    
        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make('12345678'); // Contraseña default
        $user->save();
    
        // Asignar rol (relación muchos a muchos)
        $user->roles()->attach($request->role_id);
    
        return response()->json(['mensaje' => 'Usuario creado']);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
    
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required','email', Rule::unique('users')->ignore($user->id)],
            'role_id' => 'required|exists:roles,id'
        ]);
    
        $user->name = $request->name;
        $user->email = $request->email;
        $user->save();
    
        // Actualizar relación en la tabla pivote
        $user->roles()->sync([$request->role_id]);
    
        return response()->json(['mensaje' => 'Usuario actualizado']);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['mensaje' => 'Usuario eliminado']);
    }

    public function obtenerPerfil($id)
    {
        $usuario = User::with(['roles', 'negocios'])->find($id);

        if (!$usuario) {
            return response()->json(['mensaje' => 'Usuario no encontrado'], 404);
        }

        return response()->json([
            'id' => $usuario->id,
            'name' => $usuario->name,
            'email' => $usuario->email,
            'password' => $usuario->password,
            'foto_perfil' => $usuario->foto_perfil,
            'roles' => $usuario->roles->pluck('nombre'),
            'negocios' => $usuario->negocios,
            'created_at' => $usuario->created_at, 
            'updated_at' => $usuario->updated_at,
        ]);
        
    }

    public function actualizar(Request $request, $id, GoogleDriveService $googleDrive)
    {
        try {
            // Validar los datos del request
            $request->validate([
                'nombre' => 'required|string|max:255',
                'correo' => [
                    'required',
                    'email',
                    Rule::unique('users', 'email')->ignore($id),
                ],
                'password' => 'nullable|string|min:6',
                'foto' => 'nullable|image|max:5120', // CAMBIO AQUÍ
            ]);
    
            // Obtener el usuario
            $usuario = User::findOrFail($id);
    
            // Actualizar datos básicos
            $usuario->name = $request->nombre;
            $usuario->email = $request->correo;
    
            // Actualizar contraseña si se proporciona
            if ($request->filled('password')) {
                $usuario->password = bcrypt($request->password);
            }
    
            // Procesar la foto si viene incluida y es válida
            if ($request->hasFile('foto') && $request->file('foto')->isValid()) {
                $foto = $request->file('foto');
                \Log::info('Foto recibida', [
                    'nombre' => $foto->getClientOriginalName(),
                    'tipo' => $foto->getMimeType(),
                    'tamaño' => $foto->getSize(),
                ]);
    
                $url = $googleDrive->uploadFile($foto, $usuario->email);
    
                if ($url !== false) {
                    $usuario->foto_perfil = $url;
                } else {
                    \Log::warning('No se pudo subir la foto del usuario a Google Drive para usuario ID: ' . $usuario->id);
                }
            }
    
            // Guardar los cambios
            $usuario->save();
    
            return response()->json([
                'message' => 'Usuario actualizado correctamente',
                'foto_url' => $usuario->foto_perfil
            ]);
    
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Error al actualizar usuario: ' . $e->getMessage());
            return response()->json(['error' => 'Error interno en el servidor'], 500);
        }
    }
    
}
