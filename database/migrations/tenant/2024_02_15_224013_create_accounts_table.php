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
        Schema::create('accounts', function (Blueprint $table) {
            $table->id()->startingValue(300);
            $table->string('code');
            $table->string('name');
            $table->string('description');
            $table->enum('taxonomy', ['branch', 'leaf']);
            $table->foreignId('parent_id')
                ->constrained(table: 'accounts_branches');
            $table->foreignId('contact_id')
                ->nullable()
                ->constrained(table: 'contacts');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
