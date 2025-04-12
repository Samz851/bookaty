<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Contact;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Contact::factory()
            ->count(20)
            ->create();

        Contact::factory()
            ->count(17)
            ->state(new Sequence(
                fn (Sequence $sequence) => [
                    'company_id' => Company::get()->random()->id,
                ],
            ))
            ->create();
    }
}
