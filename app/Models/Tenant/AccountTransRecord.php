<?php

namespace App\Models\Tenant;

use App\Enums\AccountTransactionTypes;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Support\Facades\Log;

class AccountTransRecord extends Pivot
{
    protected $casts = [
        'type' => AccountTransactionTypes::class,
    ];

    protected static function booted(): void
    {
        static::creating(function ($record) {
            Log::info($record, [__LINE__, __FILE__]);
            $account = Account::where('id', $record->account_id)->first();
            $accountBalance = AccountBalance::updateOrCreate(['account_id'=> $account->id], [
                'account_id'=> $account->id,
                'code'=> $account->code
            ]);

            if ($record['type'] === AccountTransactionTypes::CREDIT) {
                $accountBalance->credit_total += $record['amount'];

            } else {
                $accountBalance->debit_total -= $record['amount'];

            }

            $accountBalance->save();
        });
    }
}
