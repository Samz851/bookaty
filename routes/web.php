<?php

use App\Models\Organization;
use App\Models\User;
use Aws\Textract\TextractClient;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Stancl\Tenancy\Middleware\InitializeTenancyBySubdomain;
use thiagoalessio\TesseractOCR\TesseractOCR;

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

Route::get('/textract', function () {
    $ocr = new TesseractOCR();
    $ocr->image('https://skysft.com/wp-content/uploads/2022/02/%D9%86%D9%85%D9%88%D8%B0%D8%AC-%D9%81%D8%A7%D8%AA%D9%88%D8%B1%D8%A9-%D8%A7%D9%84%D9%83%D8%AA%D8%B1%D9%88%D9%86%D9%8A%D8%A9-5-358x675.png');
    return $ocr->run();
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
