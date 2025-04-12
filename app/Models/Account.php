<?php

namespace App\Models;

use App\Contracts\BaseAccount as BaseAccountContract;
use App\Enums\AccountTransactionTypes;
use App\Models\Contact;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Laravel\Scout\Searchable;

class Account extends BaseAccount implements BaseAccountContract
{
    use HasFactory, Searchable;

    // protected $appends = ['accounts_balance'];
    protected static function booted(): void
    {
        static::creating(function ($account) {
            $last = self::where('parent_id', $account->parent_id)
                ->latest('code')->first();
            if ($last) {
                $lastCode = str_split($last->code, 2);
                $codePart = array_pop($lastCode);
                $lastCode[] = str_pad($codePart + 1, 2, '0', STR_PAD_LEFT);
                $newCode = implode($lastCode);
            } else {
                $branchCode = AccountsBranch::where('id', intval($account->parent_id))->first();
                $newCode = $branchCode->code.str_pad('1', 10 - strlen($branchCode->code), '0', STR_PAD_LEFT);
            }

            $account->code = $newCode;
        });
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'code';
    }

    public function debitTransactions()
    {
        // return $this->hasMany(TransRecord::class, 'debit_account_id');
        return $this->belongsToMany(TransRecord::class, 'account_trans_record')
            ->using(AccountTransRecord::class)
            ->as('dbtrans')
            ->withPivot(['type', 'amount'])
            ->wherePivot('type', AccountTransactionTypes::DEBIT);
    }

    public function creditTransactions()
    {
        // return $this->hasMany(TransRecord::class, 'credit_account_id');
        return $this->belongsToMany(TransRecord::class, 'account_trans_record')
            ->using(AccountTransRecord::class)
            ->as('crtrans')
            ->withPivot(['type', 'amount'])
            ->wherePivot('type', AccountTransactionTypes::CREDIT);
    }

    // public function accountsBalance(): HasOne
    // {
    //     return $this->hasOne(AccountBalance::class, 'account_id');
    // }

    public function getAccountsBalanceAttribute()
    {
        $balance = DB::table('account_balances')
                    ->select(['debit_total', 'credit_total', 'balance'])
                    ->where('account_id', '=', $this->id)
                    ->first();
        $balance = $balance ?? [
            'debit_total' => 0,
            'credit_total' => 0,
            'balance' => 0,
        ];
        return $balance;
    }

    // public function getBalanceAttribute(): float
    // {
    //     // $totalCredit = $this->accountBalance()->get()->pluck('crtrans')->sum('amount') ?? 0;
    //     // $totalDebit = $this->debitTransactions()->get()->pluck('dbtrans')->sum('amount') ?? 0;
    //     $accB = $this->accountBalance()->first();
    //     $balance = $accB->balance;
    //     Log::info($accB, [__LINE__, __FILE__]);
    //     return $accB;
    // }

    public function scopeWithAccountBalance(Builder $query): void
    {
        $query->leftJoin('account_balances', 'accounts.id', '=', 'account_balances.account_id');
    }

    public function contact()
    {
        return $this->belongsTo(Contact::class, 'contact_id');
    }

    public function getHasChildrenAttribute(): bool
    {
        return false;
    }

    public function scopeLeaves(Builder $query): void
    {

    }

    public function scopeRoots(Builder $query): void
    {
        
    }
}
