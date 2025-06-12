<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNegocioRedesSocialesTable extends Migration
{
    public function up()
    {
        Schema::create('negocio_redes_sociales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('negocio_id')->constrained('negocios')->onDelete('cascade');
            $table->enum('tipo', ['facebook', 'instagram', 'tiktok']);
            $table->string('url');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('negocio_redes_sociales');
    }
}
