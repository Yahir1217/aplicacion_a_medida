<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoriaNegocioTable extends Migration
{
    public function up()
    {
        Schema::create('categoria_negocio', function (Blueprint $table) {
            $table->id(); // id BIGINT (PK)
            $table->foreignId('negocio_id')->constrained('negocios')->onDelete('cascade');
            $table->foreignId('categoria_id')->constrained('categorias')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('categoria_negocio');
    }
}
