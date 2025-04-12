<?php

use App\Models\StatementTemplate;
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
        Schema::create('statements', function (Blueprint $table) {
            $table->id();
            $table->date('from');
            $table->date('to');
            $table->string('title')->nullable();
            $table->longText('content')->nullable();
            $table->foreignIdFor(StatementTemplate::class, 'template_id')->references('id')->on('statement_templates')->nullable()->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('statements');
    }
};
