<?php

namespace App\Http\Controllers\Tenant;

use App\Helpers\ArrayFormatters;
use App\Models\Account;
use App\Models\AccountsBranch;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class AccountsBranchController extends Controller
{
    private function getAll(): Collection
    {
        return AccountsBranch::with(['children', 'parent', 'accounts'])
            ->get();
    }

    private function getTree(): array
    {
        $accountTypes = ArrayFormatters::removeEmptyItems(AccountsBranch::doesntHave('parent')->get()->toArray());

        return array_map(fn ($record) => ArrayFormatters::rename_array_keys($record, [
            'name' => 'label',
            'id' => 'value',
            'children' => 'children',
        ]), $accountTypes);

    }

    private function getAllByBranch(): Collection|array
    {
        // $array = AccountsBranch::where('taxonomy', 'leaf')
        // ->where('name', '<>', 'Tax Expense')
        // ->get();

        $lastBranches = AccountsBranch::whereNull('parent_id')->get()->toArray();

        return array_map(fn ($record) => ArrayFormatters::rename_array_keys($record, [
            'name' => 'label',
            'code' => 'value',
        ]), $lastBranches);
        // foreach ($lastBranches as $branch) {
        //     // Log::info($branch, [__LINE__, __FILE__]);
        // }
        // $lastBranches= $lastBranches->groupBy('parent_accounts_branch')
        //                             ->collapse();

        // foreach ($lastBranches as $lastBranch) {
        //     $parent = $lastBranch->parent()->select('id', 'name', 'code', 'parent_accounts_branch')->first();
        //     if ( isset($array[$parent->id]) ) {
        //         $array[$parent->id]['children'][] = $lastBranch->toArray();

        //     } else {
        //         $array[$parent->id] = [
        //             'id' => $parent->id,
        //             'name' => $parent->name,
        //             'code' => $parent->code,
        //             'parent_accounts_branch' => $parent->parent()->select('id', 'name', 'code', 'parent_accounts_branch')->first(),
        //             'children' => [$lastBranch->toArray()]
        //         ];
        //     }

        // }

        // foreach ($array as $key => $value) {
        //     if ( isset($value['parent_accounts_branch'])) {
        //         // $parent = $value
        //     }
        // }
        return $lastBranches;
    }

    private function getSelectOptions(?bool $noChildren = null): array
    {
        if ($noChildren) {
            $accountTypes = AccountsBranch::get()
                ->toArray();
        } else {
            $accountTypes = AccountsBranch::doesntHave('parent')
                ->get()
                ->toArray();

            $accountTypes = ArrayFormatters::removeLeafAccounts($accountTypes, 5);
        }

        return array_map(fn ($record) => ArrayFormatters::rename_array_keys($record, [
            'name' => 'title',
            'id' => 'key',
            'children' => 'children',
        ]), $accountTypes);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        if ($request->has('selectOptions')) {

            $result = $this->getSelectOptions();

        } elseif ($request->has('tree')) {
            $result = $this->getAllByBranch();
        } elseif ($request->has('noChildren')) {
            $result = $this->getSelectOptions(true);
        } else {
            $result = $this->getAll();
        }

        return response($result);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Log::info($request->all(), [__LINE__, __FILE__]);
        $parent = AccountsBranch::create($request->except('tags'));
        if ( $request->has('tags') ) $parent->attach($request->input('tags'));

        return response($parent);
    }

    /**
     * Display the specified resource.
     */
    public function show( $parent)
    {
        // $parent->accounts;
        // $parent->child_types;
        // $parent->parent;
        Log::info($parent, [__LINE__, __FILE__]);

        $acc = AccountsBranch::where('code', $parent)
            
            ->first();
        
        $transactionsD = Account::where('code', 'like', $parent . "%")->with([
            'parent',
            'debitTransactions.creditAccounts:name',
            'creditTransactions.debitAccounts:name',
        ])->get();
        $debit = $transactionsD->pluck('debitTransactions')->flatten();
        $cred = $transactionsD->pluck('creditTransactions')->flatten();
        // ->pluck('debitTransactions', 'creditTransactions');
        $acc->debitTransactions = $debit->select('date', 'amount', 'code', 'dbtrans', 'id')->sortByDesc('date')->values()->all();
        $acc->creditTransactions = $cred->select('date', 'amount', 'code', 'crtrans', 'id')->sortByDesc('date')->values()->all();
        Log::info($debit, [__LINE__, __FILE__]);
        return response($acc);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $accountsBranch)
    {
        $data = $request->all();
        Log::info([$data, $accountsBranch], [__LINE__, __FILE__]);
        $newAccount = AccountsBranch::where('id', $accountsBranch)->first();
        if ( $request->has('tags') ) $newAccount->tags()->sync($request->input('tags'));
        return response($newAccount->refresh());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AccountsBranch $parent)
    {
        Schema::disableForeignKeyConstraints();
        $delete = AccountsBranch::truncate();
        Schema::enableForeignKeyConstraints();
        $types = AccountsBranch::all();

        return response([$delete, $types]);
    }

    // DEV
    public function getParents(Request $request): Response
    {
        $parent = AccountsBranch::with('parent')->where('id', $request->query('id'))->get();

        return response($parent);
    }

    public function removeLeafs()
    {
        $accounts = AccountsBranch::whereNull('parent_id')->get()->pluck('code', 'id');
        $updatingAccounts = AccountsBranch::whereIn('id', $accounts->keys())
            ->get();
        foreach ($updatingAccounts as $account) {
            $account->update(['code' => substr($account->code, 0, 2)]);
        }

        return response(AccountsBranch::whereIn('id', $accounts->keys())
            ->get());
    }
}
