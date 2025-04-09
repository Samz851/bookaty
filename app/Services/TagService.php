<?php

namespace App\Services;

use App\Enums\BaseAccountTaxonomy;
use App\Helpers\ArrayFormatters;
use App\Models\Tenant\Account;
use App\Models\Tenant\Tag;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class TagService
{
    public function getAllTags()
    {
        return Tag::all();
    }

    public function getTagById($id): Tag
    {
        return Tag::findOrFail($id);
    }

    public function createTag($data): Tag
    {
        return Tag::create($data);
    }

    public function updateTag($id, $data): Tag
    {
        $tag = $this->getTagById($id);
        $tag->update($data);
        return $tag;
    }

    public function deleteTag($id): bool
    {
        $tag = $this->getTagById($id);
        return $tag->delete();
    }

    public function getTagMembers($id): Collection
    {
        $tag = $this->getTagById($id);
        return $tag->accounts->concat($tag->branches);
    }

    public function getTagMembersClean($id): Collection
    {
        $members = $this->getTagMembers($id);
        // Log::info($members, [__LINE__, __FILE__]);
        // ['accounts' => $accounts, 'branches' => $branches] = $members;
        // $rawMembbers = [];
        // Check for root
        $codes = $members->pluck('code')->toArray();
        $unique_codes = ArrayFormatters::eliminate_prefixes($codes);
        // usort($branchesCodes, function ($a, $b) { 
        //     if (strlen($a) > strlen($b)) {
        //         return 1;
        //     } else if (strlen($a) < strlen($b)) {
        //         return -1;
        //     } else {
        //         return 0;
        //     }
        // });
        // Log::info($codes, [__LINE__, __FILE__]);

        // Log::info($unique_codes, [__LINE__, __FILE__]);

        $result = $members->filter(function ($member) use ($unique_codes) {
            return in_array($member->code, $unique_codes);
        });

        // Log::info(get_class($result->values()), [__LINE__, __FILE__]);
        return $result;

        
    }
    public function getTagMembersBalance($id)
    {
        $members = $this->getTagMembersClean($id);
        return $members->pluck('accounts_balance')->sum('balance');
    }

    public function getTagMembersBalanceByRange($id, $from, $to)
    {   
        $from_date = date('Y-m-d', strtotime($from));
        $to_date = date('Y-m-d', strtotime($to));
        $members = $this->getTagLeafMembers($id);
        $sum = 0;
        foreach ($members as &$member) {
            if ($member->taxonomy !== BaseAccountTaxonomy::BRANCH) {
                Log::info($member, [__LINE__, __FILE__]);

                $debit_total = $member->debitTransactions()->where('date', '>=', $from_date)->where('date', '<=', $to_date)->get()->pluck('dbtrans')->sum('amount') ?? 0;
                $credit_total = $member->creditTransactions()->where('date', '>=', $from_date)->where('date', '<=', $to_date)->get()->pluck('crtrans')->sum('amount')?? 0; 
                $sum += $debit_total + $credit_total;
            }

        }
        return $sum;
    }

    public function getTagLabel($id): string
    {
        $tag = $this->getTagById($id);
        return $tag->label;
    }

    public function getTagLeafMembers($id): Collection
    {
        $members = $this->getTagMembersClean($id);
        $codes = $members->pluck('code')->toArray();
        // $accounts = collect();
        foreach ($codes as $code) {
            $code = $code . "%";
        }
        $leaveAccounts = Account::where(function ($query) use ($codes) {
            foreach ($codes as $code) {
                $query->orWhere('code', 'like', $code . "%");
            }
        })->get();
        return $leaveAccounts;
    }
}