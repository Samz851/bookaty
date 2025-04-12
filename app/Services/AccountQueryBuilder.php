<?php
namespace App\Services;

use App\Models\BaseAccount;
use App\Models\Account;
use App\Models\AccountsBranch;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\CursorPaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AccountQueryBuilder
{
    private string $model;

    private Builder $query;

    private bool $withChildren = false;


    public function __construct(private ?int $offset = null, private ?int $limit = null){}

    public function setType(string $type): self
    {
        if ( $type === 'branch' ) {
            $this->model = AccountsBranch::class;
            $this->query = $this->model::query();
        } else if ( $type === 'account') {
            $this->model = Account::class;
            $this->query = $this->model::query();
        }

        return $this;
    }

    public function quickSearch(string|array $codes): Collection
    {
        if ( is_array($codes) ) {
            $accountsCodes = array_filter($codes, function($c) {
                return strlen($c) == 10;
            });
            $branchesCodes = array_filter($codes, function($c) {
                return strlen($c) < 10;
            });

            if ( !empty($branchesCodes) ) {
                $this->setType('branch');
                $this->query->select(['id', 'code', 'name', 'parent_id'])->whereIn('accounts_branches.code', $branchesCodes );
            }

            if ( !empty($accountsCodes) ) {
                if ( !empty($branchesCodes) ) {
                    $this->query->unionAll(DB::table('accounts')->select(['id', 'code', 'name', 'parent_id'])->whereIn('accounts.code', $accountsCodes));
                } else {
                    $this->setType('account');
                    $this->query->whereIn('code', $accountsCodes);
                }

            }
        } else {
            $codeCount = strlen($codes);
            Log::info([$codes, $codeCount], [__LINE__, __FILE__]);
            if ( $codeCount == 10 ) {
                $this->setType('account');
                $this->query->where('code', '=', $codes );
            } else {
                $this->setType('branch');
                $this->query->select(['id', 'code', 'name', 'parent_id'])->where('accounts_branches.code', 'like', $codes . '%');
                $this->query->unionAll(DB::table('accounts')->select(['id', 'code', 'name', 'parent_id'])->where('accounts.code', 'LIKE', $codes .'%'));
                // $this->query->leftJoin('accounts', function ( $join ) use ($code) {
                //     $join->on('accounts.code', 'LIKE', DB::raw("CONCAT(accounts_branches.code, '%')"));
                // });
            }
        }

        $accounts = $this->executeAccountQuery();
        return $accounts;
    }

    public static function getChildren(int $parentId): Collection|array
    {
        $children = AccountsBranch::where('id', $parentId)
                    ->with('tags')
                    ->first()
                    ->append('subitems')
                    ->subitems;
        return $children->load('tags');
    }
    public function setParentId(int $parentId): self
    {
        $this->query = $this->query->where('parent_id', $parentId);
        return $this;
    }
    public function setTaxonomy(string $taxonomy): self
    {
        if ( ! $this->model ) {
            $this->query = AccountsBranch::query();
        }

        if ( $taxonomy === 'leaf') {
            $this->query = $this->query->leaves();
        } else if ( $taxonomy === 'root' ) {
            $this->query = $this->query->roots();
        }
        return $this;
    }

    public function executeAccountQuery(): Collection
    {
        $result = $this->query;
        // Log::info(['offset' => $this->offset, 'limit' => $this->limit], [__LINE__, __FILE__]);
        if ( $this->offset && $this->limit ) {
            $result = $result->offset($this->offset)->limit($this->limit);
        }
        
        return $result->with('tags')->get();
    }


}