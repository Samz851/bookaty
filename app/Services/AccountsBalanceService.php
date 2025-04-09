<?php

namespace App\Services;

use App\Models\Tenant\Account;
use App\Models\Tenant\AccountsBranch;
use Illuminate\Support\Collection;

class AccountsBalanceService
{
    /**
     * @var array<string, array<string>>
     */
    private array $codes = [
        'branches' => [],
        'accounts' => []
    ];
    
    private string $from;
    private string $to;

    public function __construct(array $codes, string $from, string $to)
    {
        $this->codes['branches'] = array_filter($codes, function($c) {
            return strlen($c) < 10;
        });
        $this->codes['accounts'] = array_filter($codes, function($c) {
            return strlen($c) == 10;
        });
        $this->from = $from;
        $this->to = $to;
    }

    public function getAllBalances(): array
    {
        $balances = [];
        foreach ($this->codes['branches'] as $code) {
            $balances[$code] = $this->getBranchTotalBalance($code);
        }
        foreach ($this->codes['accounts'] as $code) {
            $balances[$code] = $this->getAccountTotalBalance($code);
        }
        return $balances;
    }

    private function getBranchLeafMembers($code): Collection
    {
        $members = Account::where('code', 'like', $code . "%")->get();
        return $members;
    }

    private function getBranchTotalBalance($code): float
    {
        $members = $this->getBranchLeafMembers($code);
        $totalBalance = 0;
        $fromDate = date('Y-m-d', strtotime($this->from));
        $toDate = date('Y-m-d', strtotime($this->to));
        foreach ($members as $member) {
            $debitTotal = $member->debitTransactions()->where('date', '>=', $fromDate)->where('date', '<=', $toDate)->get()->pluck('dbtrans')->sum('amount') ?? 0;
            $creditTotal = $member->creditTransactions()->where('date', '>=', $fromDate)->where('date', '<=', $toDate)->get()->pluck('crtrans')->sum('amount')?? 0; 
            $totalBalance += $debitTotal - $creditTotal;
        }
        
        return $totalBalance;
    }

    private function getAccountTotalBalance($code): float
    {
        $account = Account::where('code', $code)->first();
        $fromDate = date('Y-m-d', strtotime($this->from));
        $toDate = date('Y-m-d', strtotime($this->to));
        $debitTotal = $account->debitTransactions()->where('date', '>=', $fromDate)->where('date', '<=', $toDate)->get()->pluck('dbtrans')->sum('amount') ?? 0;
        $creditTotal = $account->creditTransactions()->where('date', '>=', $fromDate)->where('date', '<=', $toDate)->get()->pluck('crtrans')->sum('amount')?? 0; 
        $balance = $debitTotal + $creditTotal;
        return $balance;
    }
}
