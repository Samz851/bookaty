<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Organization>
 */
class OrganizationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name'=> $this->faker->company(),
            // 'uuid' => Str::uuid()->toString(),
            'website' => $this->faker->url(), 
            'email' => $this->faker->email(), 
            'phone' => $this->faker->phoneNumber(), 
            'address' => $this->faker->address(), 
            'city' => $this->faker->city(),
            'country' => $this->faker->country(),
            'onboarded' => true,
        ];
    }
}
