<?php

namespace Database\Seeders;

use App\Models\Platform;
use Illuminate\Database\Seeder;

class PlatformSeeder extends Seeder
{
    public function run(): void
    {
        $platforms = [
            'Google Ads',
            'Meta Ads',
            'TikTok Ads',
            'LinkedIn Ads',
            'Amazon Ads',
        ];

        foreach ($platforms as $name) {
            Platform::create(compact('name'));
        }
    }
}
