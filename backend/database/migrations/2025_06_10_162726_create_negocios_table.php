<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNegociosTable extends Migration
{
    public function up()
    {
        Schema::create('negocios', function (Blueprint $table) {
            $table->id(); // BIGINT PK
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('nombre');
            $table->string('logo_url')->nullable();
            $table->string('descripcion')->nullable();
            $table->string('direccion')->nullable();
            $table->boolean('servicio_domicilio')->default(false);
    
            $table->enum('estado', ['inactivo', 'vencido', 'pagado'])->default('inactivo');
            $table->date('fecha_pago')->nullable();
            $table->date('fecha_vencimiento')->nullable();
    
            $table->timestamps(); // created_at y updated_at
        });
    }
    

    public function down()
    {
        Schema::dropIfExists('negocios');
    }
}
