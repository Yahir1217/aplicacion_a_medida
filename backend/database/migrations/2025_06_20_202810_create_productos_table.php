<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductosTable extends Migration
{
    public function up()
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('negocio_id')->constrained('negocios')->onDelete('cascade');
            $table->string('nombre');
            $table->string('foto_url')->nullable();
            $table->text('descripcion')->nullable();
            $table->decimal('precio', 10, 2); // hasta 99999999.99
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('productos');
    }
}

