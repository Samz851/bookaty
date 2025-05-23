<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

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
            'domain' => 'acme',
        ]);
        $organization->run(function (Organization $organization) {
            $user = User::factory()->create([
                'organization_id' => $organization->id,
            ]);
        });
        Artisan::call('tenants:seed --tenants=' . $organization->id);
    }
}
