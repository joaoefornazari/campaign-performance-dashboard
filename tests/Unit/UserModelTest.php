<?php

namespace Tests\Unit;

use App\Models\Campaign;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_has_many_campaigns(): void
    {
        $user = User::factory()->create();
        $campaign = Campaign::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($user->campaigns->contains($campaign));
        $this->assertInstanceOf(Campaign::class, $user->campaigns->first());
    }
}
