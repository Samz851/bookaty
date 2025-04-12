<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Company>
 */
class CompanyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_name' => $this->faker->name(),
            'currency' => Arr::random(['USD', 'EGP', 'SAR', 'CAD']),
            'address' => $this->faker->address(),
            'contact_information' => $this->faker->phoneNumber()
        ];
    }
}
