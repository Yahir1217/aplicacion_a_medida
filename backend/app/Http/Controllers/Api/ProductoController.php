<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Models\Negocio;
use Illuminate\Http\Request;
use Cloudinary\Configuration\Configuration;
use Cloudinary\Cloudinary as CloudinaryClient;
use Illuminate\Support\Facades\Log;


class ProductoController extends Controller
{

    public function productosPorNegocio(Request $request, $negocioId)
    {
        $publicado = $request->query('publicado'); // 'si' o 'no', opcional

        $query = Producto::where('negocio_id', $negocioId);

        if ($publicado === 'si' || $publicado === 'no') {
            $query->where('publicado', $publicado);
        }

        $productos = $query->get();

        return response()->json($productos);
    }

    public function update(Request $request, $id)
    {
        \Log::info('Inicio actualización de producto', ['id' => $id]);
    
        try {
            $producto = Producto::find($id);
    
            if (!$producto) {
                \Log::error('Producto no encontrado');
                return response()->json(['error' => 'Producto no encontrado'], 404);
            }
    
            $producto->nombre = $request->input('nombre', $producto->nombre);
            $producto->descripcion = $request->input('descripcion', $producto->descripcion);
            $producto->precio = $request->input('precio', $producto->precio);
            $producto->stock = $request->input('stock', $producto->stock);
            $producto->negocio_id = $request->input('negocio_id', $producto->negocio_id);
    
            if ($request->hasFile('foto')) {
                \Log::info('Foto recibida para producto');
    
                $archivo = $request->file('foto');
                $negocio = Negocio::find($producto->negocio_id);
                $correo = $negocio?->user?->email ?? 'sin_email';
                $carpeta = 'aplicacion_a_medida/' . $correo . '/' . $negocio?->nombre . '/productos';
    
                $cloudinary = new CloudinaryClient([
                    'cloud' => [
                        'cloud_name' => config('cloudinary.cloud.cloud_name'),
                        'api_key'    => config('cloudinary.cloud.api_key'),
                        'api_secret' => config('cloudinary.cloud.api_secret'),
                    ],
                    'url' => ['secure' => true],
                ]);
    
                $uploadResult = $cloudinary->uploadApi()->upload($archivo->getRealPath(), [
                    'folder' => $carpeta,
                    'overwrite' => true,
                    'resource_type' => 'image'
                ]);
    
                if (!isset($uploadResult['secure_url'])) {
                    throw new \Exception('Cloudinary no devolvió URL.');
                }
    
                $producto->foto = $uploadResult['secure_url'];
            }
    
            $producto->save();
            \Log::info('Producto actualizado correctamente');
            return response()->json(['mensaje' => 'Producto actualizado correctamente'], 200);
    
        } catch (\Exception $e) {
            \Log::error('Error al actualizar producto: ' . $e->getMessage());
            return response()->json(['error' => 'Error al actualizar producto'], 500);
        }
    }

    public function store(Request $request)
{
    \Log::info('Inicio creación de producto');

    $request->validate([
        'nombre' => 'required|string|max:255',
        'precio' => 'required|numeric',
        'stock' => 'required|integer',
        'negocio_id' => 'required|exists:negocios,id',
        'foto' => 'nullable|image|max:2048'
    ]);

    try {
        $producto = new Producto();
        $producto->nombre = $request->nombre;
        $producto->descripcion = $request->descripcion ?? '';
        $producto->precio = $request->precio;
        $producto->stock = $request->stock;
        $producto->negocio_id = $request->negocio_id;
        $producto->publicado = 'no'; // o valor por defecto

        if ($request->hasFile('foto')) {
            $archivo = $request->file('foto');
            $negocio = Negocio::find($request->negocio_id);
            $correo = $negocio ? $negocio->user->email : 'sin_email';
            $carpeta = 'aplicacion_a_medida/' . $correo . '/productos';

            $cloudinary = new \Cloudinary\Cloudinary([
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

            if (!isset($uploadResult['secure_url'])) {
                throw new \Exception('Cloudinary no devolvió una URL segura.');
            }

            $producto->foto = $uploadResult['secure_url'];
        }

        $producto->save();

        \Log::info('Producto creado correctamente', ['id' => $producto->id]);

        return response()->json(['mensaje' => 'Producto creado correctamente'], 201);
    } catch (\Exception $e) {
        \Log::error('Error al crear producto: ' . $e->getMessage());
        return response()->json(['error' => 'Error al crear producto'], 500);
    }
}


public function publicar($id)
{
    \Log::info('Intentando publicar producto', ['id' => $id]);

    try {
        $producto = Producto::find($id);

        if (!$producto) {
            \Log::warning('Producto no encontrado', ['id' => $id]);
            return response()->json(['error' => 'Producto no encontrado'], 404);
        }

        $producto->publicado = 'si';
        $producto->save();

        \Log::info('Producto publicado exitosamente', ['id' => $id]);

        return response()->json(['mensaje' => 'Producto publicado correctamente']);
    } catch (\Exception $e) {
        \Log::error('Error al publicar producto', ['error' => $e->getMessage()]);
        return response()->json(['error' => 'Error al publicar el producto'], 500);
    }
}

public function actualizarEstadoPublicacion(Request $request, $id)
{
    $producto = Producto::findOrFail($id);
    $producto->publicado = $request->input('publicado') === 'si' ? 'si' : 'no';
    $producto->save();

    return response()->json(['mensaje' => 'Estado actualizado correctamente']);
}


public function destroy($id)
{
    $producto = Producto::find($id);

    if (!$producto) {
        return response()->json(['mensaje' => 'Producto no encontrado.'], 404);
    }

    $producto->delete();

    return response()->json(['mensaje' => 'Producto eliminado correctamente.']);
}

    


}
