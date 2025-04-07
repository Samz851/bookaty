<?php

use App\Models\Organization;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

// Route::get('/{all?}', function () {
//     return view('welcome');
// })->where('all', '.*')
// ->name('home');
Route::get('/one/two', function () {
    $organization = Organization::factory()->create();
    return $organization;
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
