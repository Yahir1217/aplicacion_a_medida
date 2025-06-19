<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reportes_publicaciones', function (Blueprint $table) {
            $table->id();

            // Claves foráneas
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('publicacion_id')->constrained('publicaciones')->onDelete('cascade');

            // Comentario del reporte
            $table->text('comentario');
            $table->boolean('visto')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reportes_publicaciones');
    }
};
