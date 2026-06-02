<?php

namespace Tests\Unit;

use App\Models\Campaign;
use App\Models\Platform;
use App\Models\User;
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

    public function test_campaign_belongs_to_user(): void
    {
        $user = User::factory()->create();
        $campaign = Campaign::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $campaign->user);
        $this->assertEquals($user->id, $campaign->user->id);
    }
}
