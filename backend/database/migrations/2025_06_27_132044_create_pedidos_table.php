<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('direccion_id')->nullable()->constrained('direcciones')->onDelete('set null');
    
            $table->enum('metodo_pago', ['efectivo', 'tarjeta']);
            $table->string('tarjeta_last4')->nullable();
            $table->string('tarjeta_brand')->nullable();
    
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('comision_servicio', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);
    
            $table->enum('estado', ['pendiente', 'en_proceso', 'completado', 'cancelado'])->default('pendiente');
    
            $table->timestamps();
        });
    }
    
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedidos');
    }
};
