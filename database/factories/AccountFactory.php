<?php

namespace Database\Factories;

use App\Enums\BaseAccountTaxonomy;
use App\Models\Account;
use App\Models\AccountsBranch;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
 */
class AccountFactory extends Factory
{
    // protected string $model = Account::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'description' => $this->faker->realTextBetween($minNbChars = 160, $maxNbChars = 200, $indexSize = 2),
            'taxonomy' => BaseAccountTaxonomy::LEAF,
            'parent_id' => AccountsBranch::where('taxonomy', 'leaf')
                                                ->where('name', '<>', 'Tax Expense')
                                                ->get()
                                                ->random()
                                                ->id,
            'contact_id' => null
        ];
    }
}
