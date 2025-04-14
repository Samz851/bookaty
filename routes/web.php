<?php

use App\Models\Organization;
use App\Models\User;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Stancl\Tenancy\Middleware\InitializeTenancyBySubdomain;

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

// Route::get('/{all?}', function () {
//     return view('welcome');
// })->where('all', '.*')
// ->name('home');
Route::get('/one/two', function () {
    $organization = Organization::factory()->create();
    $domain = $organization->domains()->create([
        'domain' => 'sam',
    ]);
    $organization->run(function (Organization $organization) {
        $user = User::factory()
        ->state([
            'email' => 'sam@example.com',
            'password' => Hash::make('password'),
            'organization_id' => $organization->id,
            ])
        ->create();
    });
    Artisan::call('tenants:seed --tenants=' . $organization->id);
    return $organization;
})
->withoutMiddleware([InitializeTenancyBySubdomain::class]);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
