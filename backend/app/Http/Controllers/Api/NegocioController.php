<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Negocio;
use App\Models\User;
use App\Models\HorarioNegocio;
use App\Models\Publicacion;
use App\Models\ImagenPublicacion;
use App\Models\HistoriaNegocio;
use App\Models\HistoriaImagen;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Models\ReportePublicacion;

use Cloudinary\Configuration\Configuration;
use Cloudinary\Cloudinary as CloudinaryClient;


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

    public function verDetalle($id)
    {
        $negocio = Negocio::with([
            'user:id,name', // Solo trae el nombre del usuario
            'correos',
            'telefonos',          // Agregar teléfonos
            'redesSociales',
            'horarios',
            'categorias', // Relación many-to-many ya definida
            'publicaciones.imagenes',
            'publicaciones.categorias'
        ])->find($id);

        if (!$negocio) {
            return response()->json(['message' => 'Negocio no encontrado'], 404);
        }

        return response()->json($negocio);
    }

    public function actualizar(Request $request, $id)
    {
        \Log::info('🟡 Inicio función actualizar negocio', ['id' => $id]);
    
        $negocio = Negocio::find($id);
        if (!$negocio) {
            \Log::error('🔴 Negocio no encontrado', ['id' => $id]);
            return response()->json(['error' => 'Negocio no encontrado'], 404);
        }
    
        // Mostrar todos los campos y archivos recibidos
        \Log::info('📦 Datos recibidos', ['input' => $request->all()]);
        \Log::info('📁 Archivos recibidos', ['files' => $request->allFiles()]);
    
        // Asignar campos comunes
        if ($request->has('nombre')) {
            $negocio->nombre = $request->nombre;
        }
        if ($request->has('descripcion')) {
            $negocio->descripcion = $request->descripcion;
        }
        if ($request->has('direccion')) {
            $negocio->direccion = $request->direccion;
        }
        if ($request->has('servicio_domicilio')) {
            $negocio->servicio_domicilio = $request->servicio_domicilio;
        }
    
        // Subir logo si se envía
        if ($request->hasFile('logo')) {
            \Log::info('✅ Archivo logo recibido');
            $archivo = $request->file('logo');
    
            $correo = $negocio->user->email ?? 'sin_email';
    
            // Limpiar nombre del negocio para usarlo en la ruta
            $nombreNegocio = $negocio->nombre ?? 'sin_nombre';
            $nombreNegocioLimpio = preg_replace('/[^A-Za-z0-9_\-]/', '_', $nombreNegocio);
    
            $carpeta = 'aplicacion_a_medida/' . $correo . '/Negocios/' . $nombreNegocioLimpio;
    
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
    
            try {
                $uploadResult = $cloudinary->uploadApi()->upload($archivo->getRealPath(), [
                    'folder' => $carpeta,
                    'overwrite' => true,
                    'resource_type' => 'image'
                ]);
    
                if (!isset($uploadResult['secure_url'])) {
                    return response()->json(['error' => 'No se pudo subir imagen'], 500);
                }
    
                $negocio->logo_url = $uploadResult['secure_url'];
                \Log::info('✅ Logo subido correctamente', ['url' => $uploadResult['secure_url']]);
    
            } catch (\Exception $e) {
                \Log::error('❌ Error al subir logo', ['exception' => $e->getMessage()]);
                return response()->json(['error' => 'Error al subir logo'], 500);
            }
        }
    
        $negocio->save();
        \Log::info('🟢 Negocio actualizado correctamente', ['negocio_id' => $negocio->id]);
    
        return response()->json(['mensaje' => 'Negocio actualizado correctamente'], 200);
    }
    


    public function actualizarContacto(Request $request, $id)
    {
        $negocio = Negocio::findOrFail($id);

        // Limpiar actuales
        $negocio->correos()->delete();
        $negocio->telefonos()->delete();
        $negocio->redesSociales()->delete();

        // Insertar nuevos
        foreach ($request->correos as $c) {
            $negocio->correos()->create($c);
        }

        foreach ($request->telefonos as $t) {
            $negocio->telefonos()->create($t);
        }

        foreach ($request->redes_sociales as $r) {
            $negocio->redesSociales()->create($r);
        }

        return response()->json(['mensaje' => 'Contacto actualizado correctamente']);
    }


    public function actualizarHorarios(Request $request, $id)
    {
        $horarios = $request->input('horarios');
    
        // Elimina los horarios anteriores del negocio
        HorarioNegocio::where('negocio_id', $id)->delete();
    
        // Inserta los nuevos horarios
        foreach ($horarios as $h) {
            HorarioNegocio::create([
                'negocio_id' => $id,
                'dia_semana' => $h['dia_semana'],
                'hora_apertura' => $h['hora_apertura'],
                'hora_cierre' => $h['hora_cierre'],
                'cerrado' => $h['cerrado'],
                'abierto' => !$h['cerrado'],
                'cumple_con_horario' => true,
            ]);
        }
    
        return response()->json(['message' => 'Horarios actualizados correctamente']);
    }



    public function storePublicacion(Request $request)
    {
        \Log::info('🟡 Guardando publicación - inicio', ['input' => $request->all(), 'files' => $request->allFiles()]);
    
        try {
            $request->validate([
                'negocio_id' => 'required|exists:negocios,id',
                'descripcion' => 'nullable|string',
                'pdf' => 'nullable|file|mimes:pdf',
                'imagenes.*' => 'nullable|image|max:5120',
                'imagenes_a_eliminar' => 'nullable|array'
            ]);
    
            $negocio = Negocio::with('user')->findOrFail($request->negocio_id);
    
            $correo = $negocio->user->email ?? null;
            $nombreNegocio = $negocio->nombre;
    
            if (!$correo) {
                return response()->json(['error' => 'Negocio sin usuario válido'], 422);
            }
    
            $carpeta = "aplicacion_a_medida/{$correo}/Negocios/{$nombreNegocio}/publicaciones";
    
            $cloudinary = new \Cloudinary\Cloudinary(config('cloudinary.cloud'));
    
            $pdfUrl = null;
            if ($request->hasFile('pdf')) {
                $pdf = $request->file('pdf');
                $uploadPdf = $cloudinary->uploadApi()->upload($pdf->getRealPath(), [
                    'folder' => $carpeta,
                    'resource_type' => 'raw'
                ]);
                $pdfUrl = $uploadPdf['secure_url'] ?? null;
            }
    
            // Crear o actualizar publicación
            if ($request->has('id')) {
                \Log::info('Actualizando publicación', ['id' => $request->id]);
                $publicacion = Publicacion::findOrFail($request->id);
                $publicacion->update([
                    'descripcion' => $request->descripcion,
                    'pdf' => $pdfUrl ?? $publicacion->pdf
                ]);
            } else {
                \Log::info('Creando nueva publicación');
                $publicacion = Publicacion::create([
                    'negocio_id' => $negocio->id,
                    'descripcion' => $request->descripcion,
                    'pdf' => $pdfUrl,
                    'destacado' => false // o 0 si prefieres
                ]);
                
            }
    
            // Eliminar imágenes solicitadas
            if ($request->has('imagenes_a_eliminar')) {
                \Log::info('Eliminando imágenes', ['imagenes_a_eliminar' => $request->imagenes_a_eliminar]);
                foreach ($request->imagenes_a_eliminar as $url) {
                    $imagen = ImagenPublicacion::where('imagen', $url)
                        ->where('publicacion_id', $publicacion->id)
                        ->first();
                    if ($imagen) {
                        $imagen->delete();
                        \Log::info('Imagen eliminada', ['url' => $url]);
                        // Aquí podrías agregar código para borrar imagen de Cloudinary si tienes el public_id
                    } else {
                        \Log::warning('Imagen a eliminar no encontrada en BD', ['url' => $url]);
                    }
                }
            }
    
            // Subir nuevas imágenes
            if ($request->hasFile('imagenes')) {
                \Log::info('Subiendo imágenes');
                foreach ($request->file('imagenes') as $img) {
                    $uploadImg = $cloudinary->uploadApi()->upload($img->getRealPath(), [
                        'folder' => $carpeta,
                        'resource_type' => 'image'
                    ]);
                    ImagenPublicacion::create([
                        'publicacion_id' => $publicacion->id,
                        'imagen' => $uploadImg['secure_url'] ?? null
                    ]);
                    \Log::info('Imagen subida', ['url' => $uploadImg['secure_url'] ?? null]);
                }
            }
    
            \Log::info('Publicación guardada correctamente', ['publicacion_id' => $publicacion->id]);
            return response()->json(['mensaje' => 'Publicación guardada correctamente'], 201);
    
        } catch (\Exception $e) {
            \Log::error('Error en storePublicacion: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Error interno del servidor'], 500);
        }
    }

    public function eliminarPublicacion($id)
    {
        try {
            $publicacion = Publicacion::with('imagenes')->findOrFail($id);

            // Eliminar imágenes en Cloudinary y BD
            foreach ($publicacion->imagenes as $imagen) {
                // Opcional: aquí podrías eliminar en Cloudinary usando el public_id si lo guardas
                $imagen->delete();
            }

            $publicacion->categorias()->detach(); // elimina relaciones en tabla pivote

            $publicacion->delete();

            \Log::info('✅ Publicación eliminada correctamente', ['id' => $id]);

            return response()->json(['mensaje' => 'Publicación eliminada correctamente']);
        } catch (\Exception $e) {
            \Log::error('❌ Error al eliminar publicación', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Error al eliminar la publicación'], 500);
        }
    }


    public function toggleDestacado($id)
    {
        \Log::info('Entró a toggleDestacado para id: ' . $id);
    
        try {
            $publicacion = Publicacion::findOrFail($id);
            \Log::info('Publicacion encontrada: ', $publicacion->toArray());
    
            // Alternar destacado
            $publicacion->destacado = $publicacion->destacado ? 0 : 1;
    
            if ($publicacion->destacado) {
                $maxOrden = Publicacion::where('negocio_id', $publicacion->negocio_id)
                                ->where('destacado', 1)
                                ->max('orden');
                $publicacion->orden = $maxOrden ? $maxOrden + 1 : 1;
            } else {
                $publicacion->orden = null;
            }
    
            $publicacion->save();
    
            return response()->json([
                'mensaje' => 'Estado de destacado actualizado correctamente',
                'publicacion' => $publicacion
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error al actualizar destacado: ' . $e->getMessage());
            return response()->json(['error' => 'Error interno del servidor'], 500);
        }
    }



    public function actualizarOrdenDestacadas(Request $request)
    {
        $orden = $request->input('orden');
    
        \DB::beginTransaction();
        try {
            foreach ($orden as $item) {
                Publicacion::where('id', $item['id'])->update(['orden' => $item['orden']]);
            }
            \DB::commit();
            return response()->json(['mensaje' => 'Orden actualizado correctamente'], 200);
        } catch (\Exception $e) {
            \DB::rollBack();
            \Log::error('Error al actualizar orden destacadas: ' . $e->getMessage());
            return response()->json(['error' => 'Error interno del servidor'], 500);
        }
    }


    public function PublicacionesGenerales(Request $request)
{
    $cantidad = $request->input('cantidad', 5);

    $publicaciones = Publicacion::with([
        'imagenes',
        'negocio:id,nombre,logo_url'
    ])
    ->orderByDesc('created_at')
    ->paginate($cantidad);

    return response()->json($publicaciones);

}



public function SubirReporte(Request $request)
{
    $request->validate([
        'user_id' => 'required|exists:users,id',
        'publicacion_id' => 'required|exists:publicaciones,id',
        'comentario' => 'required|string|max:1000',
    ]);

    $reporte = ReportePublicacion::create([
        'user_id' => $request->user_id,
        'publicacion_id' => $request->publicacion_id,
        'comentario' => $request->comentario,
    ]);

    return response()->json([
        'message' => 'Reporte enviado correctamente',
        'reporte' => $reporte
    ], 201);
}


public function VerReportes(Request $request)
{
    $reportes = ReportePublicacion::with([
        'usuario:id,name,email,foto_perfil,created_at',
        'publicacion:id,descripcion,negocio_id,pdf',
        'publicacion.imagenes:id,publicacion_id,imagen', // Aquí cargas las imágenes
        'publicacion.negocio:id,nombre,logo_url,user_id',
        'publicacion.negocio.user:id,name,email,foto_perfil,created_at',
        'publicacion.negocio.correos:id,negocio_id,correo',
        'publicacion.negocio.telefonos:id,negocio_id,telefono',
        'publicacion.negocio.redesSociales:id,negocio_id,tipo,url',
    ])->paginate(10);

    return response()->json($reportes);
}


public function marcarVisto($id)
{
    $reporte = ReportePublicacion::findOrFail($id);
    $reporte->visto = true;
    $reporte->save();

    return response()->json(['message' => 'Reporte marcado como visto.']);
}




    




    
}
