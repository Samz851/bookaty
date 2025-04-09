<?php

namespace App\Http\Controllers\Tenant;

use App\Models\Tenant\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Log::info( $request->user(), [__LINE__, __FILE__] );
        return response(Company::with(['contacts'])->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $company = Company::create($request->all());

        return response($company);
    }

    /**
     * Display the specified resource.
     */
    public function show(Company $company)
    {
        $company->contacts;

        return response($company);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Company $company)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Company $company)
    {
        //
    }
}
