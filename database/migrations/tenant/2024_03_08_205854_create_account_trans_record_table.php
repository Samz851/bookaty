<?php

use App\Models\Account;
use App\Models\TransRecord;
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
        Schema::create('account_trans_record', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Account::class);
            $table->foreignIdFor(TransRecord::class);
            $table->enum('type', ['debit', 'credit']);
            $table->decimal('amount');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_trans_record');
    }
};
