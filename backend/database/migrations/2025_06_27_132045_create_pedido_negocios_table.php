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
        Schema::create('pedido_negocios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pedido_id')->constrained('pedidos')->onDelete('cascade');
            $table->foreignId('negocio_id')->constrained('negocios')->onDelete('cascade');
    
            $table->enum('tipo_entrega', ['domicilio', 'recoger']);
            $table->decimal('total_negocio', 10, 2)->default(0);
    
            $table->boolean('publico')->default(false);
            $table->string('comentario')->nullable();
    
            $table->enum('estado', ['pendiente', 'en_camino', 'entregado', 'cancelado'])->default('pendiente');
    
            $table->timestamps();
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedido_negocios');
    }
};
