<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\AccountsBranch;
use App\Models\Contact;
use App\Models\Tag;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Factories\Sequence;


class AccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // $random = AccountType::doesntHave('childTypes')->get();
        // $one = $random->random()->id;
        // Log::info($random, [__LINE__, __FILE__]);
        // Log::info($one, [__LINE__, __FILE__]);
        Account::factory()
        ->state(['parent_id' => 42])
        // ->hasAttached(Tag::all()->random(2))
        ->create();
        Account::factory()
            ->count(10)
            // ->hasAttached(Tag::all()->random(2))
            ->create();
        Account::factory()
            ->count(20)
            // ->hasAttached(Tag::all()->random(2))
            ->create();

        Account::factory()
            ->count(13)
            // ->hasAttached(Tag::all()->random(2))
            ->state(new Sequence(
                fn (Sequence $sequence) => [
                    'contact_id' => Contact::get()->random()->id,
                ],
            ))
            ->create();
    }
}
