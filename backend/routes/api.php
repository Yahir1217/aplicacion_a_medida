<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\SalaController;
use App\Http\Controllers\Api\ReservaController;
use App\Http\Controllers\Api\UsuarioController;

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
});
