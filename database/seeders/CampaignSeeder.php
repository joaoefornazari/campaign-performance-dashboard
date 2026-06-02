<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\Platform;
use Illuminate\Database\Seeder;

class CampaignSeeder extends Seeder
{
    public function run(): void
    {
        $platformIds = Platform::pluck('id')->toArray();

        $campaigns = [
            ['name' => 'Summer Sale',      'spend' => 1200.50, 'revenue' => 3400.00, 'conversions' => 45],
            ['name' => 'Brand Awareness',  'spend' => 800.00,  'revenue' => 1200.00, 'conversions' => 20],
            ['name' => 'Product Launch',   'spend' => 2500.00, 'revenue' => 8900.00, 'conversions' => 120],
            ['name' => 'Retargeting Pro',  'spend' => 450.75,  'revenue' => 2100.50, 'conversions' => 78],
            ['name' => 'Holiday Campaign', 'spend' => 3200.00, 'revenue' => 15000.00,'conversions' => 250],
            ['name' => 'Lead Gen Push',    'spend' => 950.00,  'revenue' => 1800.00, 'conversions' => 35],
            ['name' => 'Flash Sale Now',   'spend' => 600.25,  'revenue' => 4300.75, 'conversions' => 95],
            ['name' => 'Email Capture',    'spend' => 300.00,  'revenue' => 900.00,  'conversions' => 15],
            ['name' => 'Video Campaign',   'spend' => 1500.00, 'revenue' => 5600.00, 'conversions' => 60],
            ['name' => 'Seasonal Push',    'spend' => 2000.00, 'revenue' => 7200.00, 'conversions' => 110],
        ];

        foreach ($campaigns as $campaign) {
            Campaign::create(array_merge($campaign, [
                'platform_id' => $platformIds[array_rand($platformIds)],
            ]));
        }
    }
}
