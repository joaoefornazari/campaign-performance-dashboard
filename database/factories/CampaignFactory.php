<?php

namespace Database\Factories;

use App\Models\Platform;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CampaignFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->regexify('[A-Z][a-z]{9,19}'),
            'spend' => fake()->randomFloat(2, 100, 10000),
            'revenue' => fake()->randomFloat(2, 100, 50000),
            'conversions' => fake()->numberBetween(1, 1000),
            'platform_id' => Platform::factory(),
            'user_id' => User::factory(),
        ];
    }
}
