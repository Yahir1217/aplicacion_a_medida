<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoriasTable extends Migration
{
    public function up()
    {
        Schema::create('categorias', function (Blueprint $table) {
            $table->id(); // id BIGINT (PK)
            $table->string('nombre'); // nombre VARCHAR
            $table->string('descripcion')->nullable(); // descripcion VARCHAR (nullable por si no se desea llenar)
            $table->timestamps(); // created_at y updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('categorias');
    }
}
