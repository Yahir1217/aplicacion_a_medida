<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UsuarioController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\NegocioController;
use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Api\CarritoProductoController;
use App\Http\Controllers\Api\StripeTarjetaController;
use App\Http\Controllers\Api\DireccionController;

use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

/**
 * API Routes
 * 
 * Este archivo define las rutas disponibles para el API de la aplicación,
 * incluyendo rutas públicas (como login) y rutas protegidas mediante autenticación.
 */

// Ruta pública para iniciar sesión y obtener el token JWT
Route::post('/login', [AuthController::class, 'login']);

/**
 * Rutas protegidas por middleware 'auth:api'
 * 
 * Estas rutas solo pueden ser accedidas por usuarios autenticados mediante JWT.
 */
Route::middleware('auth:api')->group(function () {

    /**
     * Rutas relacionadas con la gestión de usuarios
     */

    // Obtener nombre y correo electrónico de un usuario por ID
    Route::get('/usuario/{id}', [UsuarioController::class, 'obtenerUsuario']);


    Route::get('/roles', [RoleController::class, 'index']);
    Route::post('/roles', [RoleController::class, 'store']);
    Route::put('/roles/{id}', [RoleController::class, 'update']);
    Route::delete('/roles/{id}', [RoleController::class, 'destroy']);   

    Route::get('/usuarios', [UsuarioController::class, 'index']);
    Route::post('/usuarios', [UsuarioController::class, 'store']);
    Route::put('/usuarios/{id}', [UsuarioController::class, 'update']);
    Route::delete('/usuarios/{id}', [UsuarioController::class, 'destroy']);

    Route::get('/categorias', [CategoriaController::class, 'index']);
    Route::post('/categorias', [CategoriaController::class, 'store']);
    Route::put('/categorias/{id}', [CategoriaController::class, 'update']);
    Route::delete('/categorias/{id}', [CategoriaController::class, 'destroy']);

    Route::get('/negocios', [NegocioController::class, 'index']);
    Route::post('/negocios', [NegocioController::class, 'store']);
    Route::put('/negocios/{id}', [NegocioController::class, 'update']);
    Route::delete('/negocios/{id}', [NegocioController::class, 'destroy']);

    //Rutas la vista del negocio
    Route::get('/negocios/{id}', [NegocioController::class, 'NegocioCompleto']);
    Route::post('/negocios/{id}', [NegocioController::class, 'ActualizarNegocioCompleto']);
    Route::post('/negocios/{id}/actualizar-contacto', [NegocioController::class, 'actualizarContacto']);
    Route::put('/negocios/{id}/horarios', [NegocioController::class, 'actualizarHorarios']);
    Route::post('/publicaciones', [NegocioController::class, 'actualizarPublicacion']);
    Route::delete('/publicaciones/{id}', [NegocioController::class, 'eliminarPublicacion']);
    Route::put('/publicaciones/{id}/destacar', [NegocioController::class, 'toggleDestacado']);
    Route::put('/publicaciones/destacadas/orden', [NegocioController::class, 'actualizarOrdenDestacadas']);


    Route::get('/usuario/perfil/{id}', [UsuarioController::class, 'obtenerPerfil']);
    Route::post('/usuarios/{id}/actualizar', [UsuarioController::class, 'actualizarPerfil']);
    Route::post('/enviar-codigo-verificacion/{id}', [UsuarioController::class, 'enviarCodigoVerificacion']);
    Route::post('/verificar-codigo-email', [UsuarioController::class, 'verificarCodigoEmail']);
 
    ///GENERALES
    Route::get('/publicaciones', [NegocioController::class, 'PublicacionesGenerales']);
    Route::get('/negocios_generales', [NegocioController::class, 'NegociosGenerales']);
    Route::get('/usuarios_generales', [NegocioController::class, 'UsuariosGenerales']);
    Route::put('usuarios/{id}/visibilidad', [UsuarioController::class, 'cambiarVisibilidad']);

    Route::post('/reportes', [NegocioController::class, 'SubirReporte']);
    Route::post('/publicaciones/usuario', [NegocioController::class, 'GuardarPublicacionUsuario']);

    ///ADMINISTRADOR
    Route::get('/reportes-publicaciones', [NegocioController::class, 'VerReportes']);
    Route::post('/reportes/{id}/marcar-visto', [NegocioController::class, 'marcarVisto']);

    ///EMPRENDEDOR
    Route::get('/mi-negocio', [NegocioController::class, 'obtenerMiNegocios']);
    Route::get('/negocios/{negocio}/productos', [ProductoController::class, 'productosPorNegocio']);

    Route::post('/productos', [ProductoController::class, 'store']);
    Route::post('/productos/{id}/actualizar', [ProductoController::class, 'update']);
    Route::post('/productos/{id}/publicar', [ProductoController::class, 'publicar']);
    Route::put('/productos/{id}/publicar', [ProductoController::class, 'actualizarEstadoPublicacion']);
    Route::delete('/productos/{id}', [ProductoController::class, 'destroy']);

    ///CARRITO
    Route::post('/carrito-productos', [CarritoProductoController::class, 'store']);
    Route::get('/carrito-productos', [CarritoProductoController::class, 'index']);
    Route::put('/carrito/{id}', [CarritoProductoController::class, 'update']);
    Route::delete('/carrito/{id}', [CarritoProductoController::class, 'destroy']);

    ///STRIPEA
    Route::post('/stripe/tarjetas', [StripeTarjetaController::class, 'store']);
    Route::get('/stripe/tarjetas', [StripeTarjetaController::class, 'obtenerTarjetas']);

    ///DIRECCION
    Route::post('/usuarios/{userId}/direccion', [DireccionController::class, 'crearDireccion']);
    Route::put('/usuarios/{userId}/direccion/{direccionId}', [DireccionController::class, 'actualizarDireccion']);

    Route::post('/negocios/{negocioId}/direccion', [DireccionController::class, 'crearDireccionNegocio']);
    Route::put('/negocios/{negocioId}/direccion/{direccionId}', [DireccionController::class, 'actualizarDireccionNegocio']);

    



    




});
Route::middleware('auth:api')->get('/usuario', function(Request $request) {
    return $request->user();
});


Route::get('/geocodificar', [UsuarioController::class, 'geocodificar']);




