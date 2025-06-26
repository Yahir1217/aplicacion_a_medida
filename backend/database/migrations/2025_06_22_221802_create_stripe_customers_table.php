<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('stripe_customers', function (Blueprint $table) {
            $table->id();
            $table->morphs('stripe_customerable'); // Crea: stripe_customerable_id y stripe_customerable_type
            $table->string('stripe_customer_id')->unique();
            $table->string('default_payment_method')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('stripe_customers');
    }
};


