<?php

namespace Tests\Unit;

use App\Models\Campaign;
use App\Models\Platform;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlatformModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_platform_has_many_campaigns(): void
    {
        $platform = Platform::factory()->create();
        $campaign = Campaign::factory()->create(['platform_id' => $platform->id]);

        $this->assertTrue($platform->campaigns->contains($campaign));
        $this->assertInstanceOf(Campaign::class, $platform->campaigns->first());
    }
}
