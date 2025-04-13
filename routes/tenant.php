<?php

declare(strict_types=1);

use App\Http\Controllers\Tenant\UserController;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\InitializeTenancyBySubdomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Here you can register the tenant routes for your application.
| These routes are loaded by the TenantRouteServiceProvider.
|
| Feel free to customize them however you want. Good luck!
|
*/

Route::middleware([
    InitializeTenancyBySubdomain::class,
    'api',
    // PreventAccessFromCentralDomains::class,
])->prefix('api')
->group(base_path('routes/apiten.php'));

Route::middleware([
    InitializeTenancyBySubdomain::class,
    PreventAccessFromCentralDomains::class,
    'web',

])->group(function () {
    Route::post('/users/login', [UserController::class, 'login']);
    Route::get('/users/authenticated', [UserController::class, 'isAuthenticated']);
    Route::get('/{all?}', function () {
            return view('welcome');
        })->where('all', '.*')
        ->name('home');


});
Route::group(['prefix' => config('sanctum.prefix', 'sanctum')], static function () {
    Route::get('/csrf-cookie', [CsrfCookieController::class, 'show'])
        ->middleware([
            'web',
            InitializeTenancyBySubdomain::class // Use tenancy initialization middleware of your choice
        ])->name('sanctum.csrf-cookie');
});
