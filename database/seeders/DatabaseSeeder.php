<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        $organization = Organization::factory()->create();
        $domain = $organization->domains()->create([
            'domain' => 'acme.accountak.local',
        ]);
        $organization->run(function () {
            $user = User::factory()->create();
        });
    }
}
