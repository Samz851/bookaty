<?php

namespace App\Http\Controllers\Tenant;

use App\Models\Tax;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TaxesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return response(Tax::inRandomOrder()
            ->paginate()
            ->items());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): Response
    {
        $tax = Tax::create($request->all());

        return response($tax);
    }

    /**
     * Display the specified resource.
     */
    public function show(Tax $tax): Response
    {
        $tax->total;

        return response($tax);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tax $tax): Response
    {
        $tax->update($request->all());
        return response($tax);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tax $tax): Response
    {
        $tax->delete();
        return new Response(null, 204);
    }
}
