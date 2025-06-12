<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('historias_imagenes', function (Blueprint $table) {
            $table->id(); // id BIGINT (PK)
            $table->foreignId('historia_id')->constrained('historias_negocio')->onDelete('cascade'); // FK → historias_negocio.id
            $table->string('url_imagen'); // url_imagen VARCHAR
            $table->integer('orden')->default(0); // orden para ordenar imágenes
            $table->timestamps(); // created_at y updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historias_imagenes');
    }
};
