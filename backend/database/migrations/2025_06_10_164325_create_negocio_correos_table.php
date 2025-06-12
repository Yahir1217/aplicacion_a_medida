<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('negocio_correos', function (Blueprint $table) {
            $table->id(); // id BIGINT (PK)
            $table->foreignId('negocio_id')->constrained('negocios')->onDelete('cascade'); // FK → negocios.id
            $table->string('correo'); // correo
            $table->timestamps(); // created_at y updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('negocio_correos');
    }
};

