<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UsuarioController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\NegocioController;
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

    Route::get('/usuario/perfil/{id}', [UsuarioController::class, 'obtenerPerfil']);
    Route::post('/usuarios/{id}/actualizar', [UsuarioController::class, 'actualizar']);


});



