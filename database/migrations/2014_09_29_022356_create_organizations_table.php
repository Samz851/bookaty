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
        Schema::create('organizations', function (Blueprint $table) {
            // $table->unsignedBigInteger('key', true)->index();
            $table->string('id')->primary()->index();

            // your custom columns may go here

            // $table->timestamps();
            $table->json('data')->nullable();

            // $table->uuid();
            $table->boolean('onboarded')->default(false);
            $table->string('logo')->nullable();
            $table->string('name');
            $table->string('website')->nullable();
            $table->string('symbol')->nullable();
            $table->string('email');
            $table->string('phone');
            $table->string('address');
            $table->string('city');
            $table->string('country');
            $table->json('departments')->nullable();
            $table->integer('primary')->default(0);
            $table->json('permissions')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organizations');
    }
};
