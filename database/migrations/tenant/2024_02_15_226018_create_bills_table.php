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
        Schema::create('bills', function (Blueprint $table) {
            $table->id();
            $table->string('bill_number')->unique();
            $table->date('date');
            $table->date('due_date');
            $table->decimal('total_amount', 15, 2);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->string('currency', 3)->default('USD');
            $table->string('status')->default('unpaid');
            $table->string('payment_terms')->nullable();
            $table->text('notes')->nullable();
            $table->text('description')->nullable();
            $table->foreignId('vendor_id')
                ->constrained('companies');
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
        Schema::dropIfExists('bills');
    }
};
