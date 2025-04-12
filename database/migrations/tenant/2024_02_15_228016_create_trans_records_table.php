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
        Schema::create('trans_records', function (Blueprint $table) {
            $table->id();
            $table->string('code');
            $table->date('date');
            $table->string('name');
            $table->string('description');
            $table->decimal('amount');
            // $table->foreignId('trans_type_id')->constrained('transaction_types');
            $table->nullableMorphs('noteable');
            $table->foreignId('trans_id')
                    ->nullable()
                    ->constrained('trans_records');
            $table->foreignId('tax_id')
                    ->nullable()
                    ->constrained('taxes');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trans_records');
    }
};
