<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('publicaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('negocio_id')->constrained('negocios')->onDelete('cascade');
            $table->text('descripcion');
            $table->string('pdf')->nullable();
            $table->boolean('destacado')->default(false); // Campo sí/no
            $table->unsignedInteger('orden')->nullable(); // Solo se usará si está destacado
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('publicaciones');
    }
};


