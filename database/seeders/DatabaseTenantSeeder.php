<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\AccountsBranch;
use App\Models\Invoice;
use Illuminate\Database\Seeder;

class DatabaseTenantSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CompanySeeder::class,
            ContactSeeder::class,
            TagSeeder::class,
            AccountsBranchSeeder::class,
            AccountSeeder::class,
            InvoiceSeeder::class,
            BillSeeder::class,
            TaxSeeder::class,
            TransRecordSeeder::class,
            FormulaSeeder::class,
        ]);
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
