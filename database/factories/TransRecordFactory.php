<?php

namespace Database\Factories;

use App\Models\Tax;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TransRecord>
 */
class TransRecordFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'date' => $this->faker->dateTimeBetween('-12 months', 'now'),
            'name' => $this->faker->word(),
            'description' => $this->faker->realTextBetween($minNbChars = 160, $maxNbChars = 200, $indexSize = 2),
            'tax_id' => Tax::all()->random()->id,
        ];
    }
}
