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
use Cloudinary\Configuration\Configuration;
use Cloudinary\Cloudinary as CloudinaryClient;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;



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
            'email_verified_at' => $usuario->email_verified_at,
            'password' => $usuario->password,
            'foto_perfil' => $usuario->foto_perfil,
            'roles' => $usuario->roles->pluck('nombre'),
            'negocios' => $usuario->negocios,
            'created_at' => $usuario->created_at, 
            'updated_at' => $usuario->updated_at,
        ]);
        
    } 


    public function actualizarPerfil(Request $request, $id)
    {
        \Log::info('Inicio función actualizar', ['id' => $id]);
    
        try {
            $usuario = User::find($id);
    
            if (!$usuario) {
                \Log::error('Usuario no encontrado');
                return response()->json(['error' => 'Usuario no encontrado'], 404);
            }
    
            \Log::info('Usuario encontrado', [
                'id' => $usuario->id,
                'name' => $usuario->name,
                'email' => $usuario->email
            ]);
    
            if ($request->has('name')) {
                $usuario->name = $request->name;
                \Log::info('Nombre actualizado', ['nuevo_name' => $request->name]);
            }
    
            if ($request->has('email')) {
                $usuario->email = $request->email;
                \Log::info('Correo actualizado', ['nuevo_email' => $request->email]);
            }
    
            if ($request->hasFile('foto')) {
                \Log::info('Archivo de imagen recibido');
    
                $archivo = $request->file('foto');
                $correo = $usuario->email ?? 'sin_email';
                $carpeta = 'aplicacion_a_medida/' . $correo;
    
                $cloudinary = new CloudinaryClient([
                    'cloud' => [
                        'cloud_name' => config('cloudinary.cloud.cloud_name'),
                        'api_key'    => config('cloudinary.cloud.api_key'),
                        'api_secret' => config('cloudinary.cloud.api_secret'),
                    ],
                    'url' => [
                        'secure' => true,
                    ],
                ]);
    
                $uploadResult = $cloudinary->uploadApi()->upload($archivo->getRealPath(), [
                    'folder' => $carpeta,
                    'overwrite' => true,
                    'resource_type' => 'image'
                ]);
    
                \Log::info('Respuesta de Cloudinary', ['uploadResult' => $uploadResult]);
    
                if (!isset($uploadResult['secure_url'])) {
                    throw new \Exception('Cloudinary no devolvió una URL segura.');
                }
    
                $url = $uploadResult['secure_url'];
                $usuario->foto_perfil = $url;
    
                \Log::info('Foto actualizada en Cloudinary', ['url' => $url]);
            }
    
            $usuario->save();
            \Log::info('Usuario actualizado correctamente');
    
            return response()->json(['mensaje' => 'Usuario actualizado correctamente'], 200);
    
        } catch (\Exception $e) {
            \Log::error('Error al actualizar usuario: ' . $e->getMessage());
            return response()->json(['error' => 'Error al actualizar usuario'], 500);
        }
    }

    public function enviarCodigoVerificacion($id)
    {
        $usuario = User::find($id);

        if (!$usuario) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        // Generar un código de 6 caracteres: letras y números
        $codigo = Str::random(6);

        // Guardar el código en remember_token
        $usuario->remember_token = $codigo;
        $usuario->save();

        // Enviar correo con el código
        Mail::to($usuario->email)->send(new \App\Mail\CodigoVerificacionMail($codigo, $usuario->name));

        return response()->json(['mensaje' => 'Correo enviado correctamente']);
    }

    public function verificarCodigoEmail(Request $request)
{
    $validator = Validator::make($request->all(), [
        'id' => 'required|integer|exists:users,id',
        'codigo' => 'required|string|size:6',
    ]);

    if ($validator->fails()) {
        return response()->json(['message' => 'Datos inválidos'], 422);
    }

    $user = User::find($request->id);

    if (!$user) {
        return response()->json(['message' => 'Usuario no encontrado'], 404);
    }

    if ($user->remember_token !== $request->codigo) {
        return response()->json(['message' => 'Código incorrecto'], 403);
    }

    // Actualizar email_verified_at si es null
    if (is_null($user->email_verified_at)) {
        $user->email_verified_at = Carbon::now();
        $user->remember_token = null; // opcional: limpiar código
        $user->save();
    }

    return response()->json(['message' => 'Correo verificado con éxito']);
}



}
 