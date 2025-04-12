<?php

use App\Http\Controllers\Tenant\AccountController;
use App\Http\Controllers\Tenant\AccountsBranchController;
use App\Http\Controllers\Tenant\CompanyController;
use App\Http\Controllers\Tenant\ContactController;
use App\Http\Controllers\Tenant\FormulaController;
use App\Http\Controllers\OptionsController;
use App\Http\Controllers\Tenant\StatementController;
use App\Http\Controllers\Tenant\StatementTemplateController;
use App\Http\Controllers\Tenant\TagController;
use App\Http\Controllers\Tenant\TaxesController;
use App\Http\Controllers\Tenant\TransactionsController;
use App\Http\Controllers\Tenant\UserController;
use App\Models\AccountsBranch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

foreach (config('tenancy.central_domains') as $domain) {
    Route::domain($domain)->group(function () {
        Route::get('/generateBalances', [TransactionsController::class, 'generateBalances']);
        Route::get('/getTagMembers', [TagController::class, 'getTagMembers']);
        Route::get('/getTagBalance', [TagController::class, 'getTagBalance']);
        Route::get('/getTagLeafMembers', [TagController::class, 'getTagLeafMembers']);
        Route::get('/getTagBalanceByRanges', [TagController::class, 'getTagBalanceByRanges']);
        Route::get('/test', [StatementController::class, 'test']);

        Route::middleware('auth:sanctum')->group(function () {
            // Route::get('/accounts', [AccountController::class, 'index']);
            Route::get('/accounts/search', [AccountController::class,'search']);

            Route::apiResource('/accounts', AccountController::class);
            Route::get('/test_accounts', [AccountController::class, 'testAccounts']);
            Route::apiResource('/transactions', TransactionsController::class);
            Route::apiResource('/taxes', TaxesController::class);
            Route::apiResource('/companies', CompanyController::class);
            Route::apiResource('/contacts', ContactController::class);
            Route::apiResource('/branches', AccountsBranchController::class);
            Route::apiResource('/options', OptionsController::class);
            Route::apiResource('/tags', TagController::class);
            Route::apiResource('/statements', StatementTemplateController::class);
            Route::apiResource('/reports', StatementController::class);
            Route::apiResource('/formula', FormulaController::class);
            Route::post('/formula/validate', [FormulaController::class, 'validateFormula']);
            Route::get('/removeLeafs', [AccountsBranchController::class, 'removeLeafs']);
            Route::get('/accounts/select', [AccountController::class, 'getSelect']);
            Route::get('/users/autologin', [UserController::class, 'autlogin']);
            Route::get('/users/authenticated', [UserController::class, 'isAuthenticated']);
        });
    });
}
