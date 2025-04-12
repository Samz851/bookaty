<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('trans_taxes', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount');
            $table->foreignId('trans_id')->constrained('trans_records');
            $table->foreignId('tax_id')->constrained('taxes');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trans_taxes');
    }
};
