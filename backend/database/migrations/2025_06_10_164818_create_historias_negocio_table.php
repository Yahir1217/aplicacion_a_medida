<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('historias_negocio', function (Blueprint $table) {
            $table->id(); // id BIGINT (PK)
            $table->foreignId('negocio_id')->constrained('negocios')->onDelete('cascade'); // FK → negocios.id
            $table->string('titulo'); // título
            $table->timestamps(); // created_at y updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historias_negocio');
    }
};
