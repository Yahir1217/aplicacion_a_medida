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
            $table->text('descripcion')->nullable();
            $table->string('foto')->nullable();
            $table->decimal('precio', 10, 2)->default(0);
            $table->integer('stock')->default(0);
            $table->enum('publicado', ['si', 'no'])->default('no');
            $table->timestamps();
        });
    }
    

    public function down()
    {
        Schema::dropIfExists('productos');
    }
}


