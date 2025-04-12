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
        Schema::create('account_balances', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Account::class);
            $table->string('code');
            $table->decimal('debit_total')->default(0);
            $table->decimal('credit_total')->default(0);
            $table->decimal('balance')->storedAs("debit_total + credit_total");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_balances');
    }
};
