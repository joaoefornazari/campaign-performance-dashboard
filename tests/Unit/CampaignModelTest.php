<?php

namespace Tests\Unit;

use App\Models\Campaign;
use App\Models\Platform;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CampaignModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_campaign_belongs_to_platform(): void
    {
        $platform = Platform::factory()->create();
        $campaign = Campaign::factory()->create(['platform_id' => $platform->id]);

        $this->assertInstanceOf(Platform::class, $campaign->platform);
        $this->assertEquals($platform->id, $campaign->platform->id);
    }
}
