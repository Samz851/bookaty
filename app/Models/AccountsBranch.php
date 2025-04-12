<?php

namespace App\Models;

use App\Contracts\BaseAccount as BaseAccountContract;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Laravel\Scout\Searchable;

class AccountsBranch extends BaseAccount implements BaseAccountContract
{
    use HasFactory, Searchable;

    protected $appends = [
        // 'balance',
        'code_label',
        'tree_path',
        'has_children',
        'children',
        'accounts_balance'
    ];
    protected static function booted(): void
    {
        static::creating(function ($branch) {
            if (isset($branch->parent_id)) {
                $last = self::where('parent_id', $branch->parent_id)
                    ->latest('code')->first();
                if ($last) {
                    $lastCode = str_split($last->code, 2);
                    $codePart = array_pop($lastCode);
                    $lastCode[] = str_pad($codePart + 1, 2, '0', STR_PAD_LEFT);
                    $newCode = implode($lastCode);
                } else {
                    $parentCode = self::where('id', intval($branch->parent_id))->first();

                    $lastCode = str_split($parentCode->code, 2);

                    // $codePart = array_pop($lastCode);
                    if (count($lastCode) === 2 && $lastCode[1] === '00') {
                        $codePart = array_pop($lastCode);
                        $lastCode[] = '01';

                    } else {
                        $lastCode[] = '01';
                    }
                    $newCode = implode($lastCode);
                }
            } else {
                $last = self::whereNull('parent_id')
                    ->latest('code')->first();
                if ($last) {
                    $codePart = $last->code;
                    $newCode = str_pad($codePart + 1, 2, '0', STR_PAD_LEFT);
                } else {
                    $newCode = '01';
                }
            }

            $branch->code = $newCode;
        });
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'code';
    }

    public function subbranches(): HasMany
    {
        // Log::info([$this->taxonomy, $this->getAttributes(), $this->getAttribute('taxonomy'),$this->getAttributeValue('name')], [__FILE__, __LINE__]);
        return $this->hasMany(AccountsBranch::class, 'parent_id');
    }

    public function accounts(): HasMany
    {
        return $this->hasMany(Account::class, 'parent_id');
    }

    public function getSubitemsAttribute()
    {
        $subitems = $this->subbranches()->get();
        if ($subitems->isEmpty()) {
            $subitems = $this->accounts()->get();
        }

        return $subitems;
    }

    // public function getChildrenAttribute()
    // {

    //     $children = $this->subbranches()->get();
    //     if ($children->isEmpty()) {
    //         $children = $this->accounts()->get();
    //     }

    //     return $children;
    // }

    public function getChildrenAttribute()
    {
        if ($this->subbranches()->exists()) {
            return [];
        }
        if ($this->accounts()->exists()) {
            return [];
        }

        return false;
    }

    public function getAccountsBalanceAttribute()
    {
        $balances = DB::table('account_balances')
                    ->select(['debit_total', 'credit_total', 'balance'])
                    ->where('code', 'like', $this->code . '%')
                    ->get();
        $attr = [
            'debit_total' => $balances->pluck('debit_total')->sum(),
            'credit_total' => $balances->pluck('credit_total')->sum(),
            'balance' => $balances->pluck('balance')->sum(),
        ];
        return $attr;
    }
    // public function getBalanceAttribute(): float
    // {
    //     // Log::info([$this->children, $this->getAttributes(), $this->attributes], [__FILE__, __LINE__]);
    //     return round($this->subitems->pluck('balance')->sum(), 2);
    // }

    public function getHasChildrenAttribute(): bool
    {
        $this->children = [];
        if ($this->subbranches()->exists()) {
            return true;
        }
        if ($this->accounts()->exists()) {
            return true;
        }

        return false;
    }

    public function scopeLeaves(Builder $query): void
    {
        $query->doesntHave('subbranches');
    }

    public function scopeRoots(Builder $query): void
    {
        $query->doesntHave('parent');
    }
}
