<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCarritoProductosTable extends Migration
{
    public function up(): void
    {
        Schema::create('carrito_productos', function (Blueprint $table) {
            $table->id();

            // Usuario que añadió al carrito (nullable por si es anónimo)
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');

            // Producto añadido
            $table->foreignId('producto_id')->constrained('productos')->onDelete('cascade');

            // Cantidad de productos
            $table->unsignedInteger('cantidad')->default(1);

            // Estado del producto en el carrito
            $table->enum('estado', ['pendiente', 'comprado'])->default('pendiente');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carrito_productos');
    }
}
