<?php

namespace App\Http\Controllers\Tenant;

use App\Models\Tenant\Account;
use App\Services\AccountServices;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class AccountController extends Controller
{
    public function __construct(private AccountServices $accountServices)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $accounts = $this->accountServices->getAccounts($request->query());

        return response($accounts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): Response
    {
        $account = Account::create($request->except('tags'));

        if ( $request->has('tags') ) $account->tags()->attach($request->input('tags'));
        
        return response($account);
    }

    /**
     * Display the specified resource.
     */
    public function show(Account $account)
    {
        $account->parent;
        $account->debitTransactions;
        $account->creditTransactions;
        $account->contact;
        $acc = Account::where('id', $account->id)
            ->with([
                'parent',
                'debitTransactions.creditAccounts:name',
                'creditTransactions.debitAccounts:name',
            ])
            ->first();

        $acc->debitTransactions = $acc->debitTransactions->sortByDesc('date')->values()->all();
        $acc->creditTransactions = $acc->creditTransactions->sortByDesc('date')->values()->all();

        return response($acc);
    }

    public function search(Request $request): Response
    {
        $result = $this->accountServices->searchAccounts($request->query('code'));
        return response(['success' => true, 'result' => $result]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Account $account)
    {
        $data = $request->all();
        Log::info($data, [__LINE__, __FILE__]);
        if ( $request->has('tags') ) $account->tags()->sync($request->input('tags'));
        $newAccount = Account::where('id', $account->id)->first();
        return response($newAccount);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Account $account)
    {
        //
    }
}
