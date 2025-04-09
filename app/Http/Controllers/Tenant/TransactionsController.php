<?php

namespace App\Http\Controllers\Tenant;

use App\Enums\AccountTransactionTypes;
use App\Models\Tenant\Account;
use App\Models\Tenant\AccountBalance;
use App\Models\Tenant\TransRecord;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

class TransactionsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $transactions = TransRecord::with(['noteable', 'debitAccounts', 'creditAccounts', 'payment'])
            ->orderBy('date', 'desc')
            // ->where('date', '>=', '2024-03-01')
            // ->paginate()
            ->get();

        return response($transactions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): Response
    {
        $data = $request->all();
        $data['date'] = now();
        $debitAccounts = Arr::pull($data, 'debit_accounts', false);
        $creditAccounts = Arr::pull($data, 'credit_accounts', false);
        $createPayment = Arr::pull($data, 'issue_payment', false);
        $transaction = TransRecord::create($data);
        if ($debitAccounts) {
            foreach ($debitAccounts as $debitAccount) {
                // Update Account balance table
                $accountModel = Account::find($debitAccount['id']);
                $debitBalance = AccountBalance::updateOrCreate(['account_id'=> $accountModel->id], [
                    'account_id'=> $accountModel->id,
                    'code'=> $accountModel->code
                ]);

                $debitBalance->debit_total -= $debitAccount['amount'];

                $debitBalance->save();
                $transaction->debitAccounts()->attach($debitAccount['id'], [
                    'type' => AccountTransactionTypes::DEBIT,
                    'amount' => $debitAccount['amount'],
                ]);
            }
        }
        if ($creditAccounts) {
            foreach ($creditAccounts as $creditAccount) {
                $accountModel = Account::find($creditAccount['id']);
                $creditBalance = AccountBalance::updateOrCreate(['account_id'=> $accountModel->id], [
                    'account_id'=> $accountModel->id,
                    'code'=> $accountModel->code
                ]);

                $creditBalance->credit_total -= $creditAccount['amount'];

                $creditBalance->save();

                $transaction->creditAccounts()->attach($creditAccount['id'], [
                    'type' => AccountTransactionTypes::CREDIT,
                    'amount' => $creditAccount['amount'],
                ]);
            }
        }
        if ($createPayment) {
            $payment = $transaction->payment()->create(['date' => now(), 'amount' => $data['amount']]);
        }
        // Reload model with children
        $transaction = TransRecord::where('id', $transaction->id)
            ->with(['noteable', 'debitAccounts', 'creditAccounts', 'payment'])
            ->first();

        return response($transaction);
    }

    public function generateBalances(Request $request): Response
    {
        $accounts = Account::all();
        foreach ($accounts as $account) {
            $debit_total = $account->debitTransactions()->get()->pluck('dbtrans')->sum('amount') ?? 0;
            $credit_total = $account->creditTransactions()->get()->pluck('crtrans')->sum('amount')?? 0;
            $accountBalance = AccountBalance::create([
                'account_id' => $account->id,
                'code' => $account->code,
                'debit_total' => -$debit_total,
                'credit_total' => $credit_total,
            ]);

            $accountBalance->save();
        }
        return response(['message' => 'Balances generated successfully.']);
    }
    /**
     * Display the specified resource.
     */
    public function show(TransRecord $transaction): Response
    {
        $trans = TransRecord::where('id', $transaction->id)
        ->with(['noteable', 'debitAccounts', 'creditAccounts', 'payment'])
        ->first();
        return response($trans);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): Response
    {
        return response(['message' => 'Update not implemented yet']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): Response
    {
        return response(['message' => 'Destroy not implemented yet']);
    }
}
