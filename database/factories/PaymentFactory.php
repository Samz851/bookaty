<?php

namespace Database\Factories;

use App\Models\TransRecord;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'amount' => $this->faker->randomFloat(2, 10, 3000),
            'payment_method' => Arr::random(['Cash', 'Check', 'Credit']),
            'trans_id' => TransRecord::get()->random()->id,
            'approved' => true
        ];
    }
}
