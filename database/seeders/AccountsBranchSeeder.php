<?php

namespace Database\Seeders;

use App\Enums\BaseAccountTaxonomy;
use App\Models\Account;
use App\Models\AccountsBranch;
use App\Models\Tag;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

class AccountsBranchSeeder extends Seeder
{

    private function generate(array $children, ?Model $parent = null)
    {
        if (! $parent) {
            foreach ($children as $childK => $childV) {
                if (is_int($childK)) {
                    AccountsBranch::factory()
                        // ->hasAttached(Tag::all()->random(2))
                        ->state(['name' => $childV])
                        ->create();
                } else {
                    $parentType = AccountsBranch::factory()
                        ->state(['name' => $childK])
                        // ->hasAttached(Tag::all()->random(2))
                        ->create();
                    $this->generate($childV, $parentType);
                }

            }

        } else {
            foreach ($children as $childK => $childV) {
                if (is_int($childK)) {
                    AccountsBranch::factory()
                        ->state([
                            'name' => $childV,
                            'parent_id' => $parent->id,
                            'taxonomy' => BaseAccountTaxonomy::LEAF,

                        ])
                        // ->hasAttached(Tag::all()->random(2))
                        ->create();
                } else {
                    $parentType = AccountsBranch::factory()
                        ->state([
                            'name' => $childK,
                            'parent_id' => $parent->id
                        ])
                        // ->hasAttached(Tag::all()->random(2))
                        ->create();
                    $this->generate($childV, $parentType);
                }

            }
        }
    }
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $accountsBranches = config('accounts_branches.branches');

        $this->generate(children: $accountsBranches);
        AccountsBranch::factory()->create();
    }
}
