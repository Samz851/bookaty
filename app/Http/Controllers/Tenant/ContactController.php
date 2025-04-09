<?php

namespace App\Http\Controllers\Tenant;

use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response(Contact::with(['company', 'accounts'])->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $contact = Contact::create($request->all());

        return response($contact);
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact)
    {
        $contact->accounts;
        $contact->company;

        return response($contact);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Contact $contact)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contact $contact)
    {
        //
    }
}
