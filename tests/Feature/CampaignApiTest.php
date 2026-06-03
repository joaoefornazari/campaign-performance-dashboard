<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\Platform;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CampaignApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_campaign(): void
    {
        $this->actingAsUser();
        $platform = Platform::factory()->create();
        $user = User::factory()->create();

        $response = $this->postJson('/api/campaigns', [
            'name' => 'Test Campaign X',
            'spend' => 1000.50,
            'revenue' => 2500.75,
            'conversions' => 50,
            'platform_id' => $platform->id,
            'user_id' => $user->id,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['id', 'name', 'spend', 'revenue', 'conversions'])
            ->assertJsonFragment(['name' => 'Test Campaign X']);
    }

    public function test_create_campaign_requires_authentication(): void
    {
        $response = $this->postJson('/api/campaigns', [
            'name' => 'Test Campaign X',
            'spend' => 1000,
            'revenue' => 2000,
            'conversions' => 10,
            'platform_id' => 1,
            'user_id' => 1,
        ]);

        $response->assertStatus(401);
    }

    public function test_can_get_campaign_by_id(): void
    {
        $this->actingAsUser();
        $campaign = Campaign::factory()->create();

        $response = $this->getJson("/api/campaigns/{$campaign->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $campaign->id]);
    }

    public function test_get_campaign_returns_404_if_not_found(): void
    {
        $this->actingAsUser();

        $response = $this->getJson('/api/campaigns/999');

        $response->assertStatus(404);
    }

    public function test_can_list_campaigns(): void
    {
        $this->actingAsUser();
        Campaign::factory()->count(5)->create();

        $response = $this->getJson('/api/campaigns');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'current_page', 'last_page', 'per_page', 'total']);
    }

    public function test_can_filter_campaigns_by_platform_id(): void
    {
        $this->actingAsUser();
        $platform1 = Platform::factory()->create();
        $platform2 = Platform::factory()->create();
        Campaign::factory()->count(3)->create(['platform_id' => $platform1->id]);
        Campaign::factory()->count(2)->create(['platform_id' => $platform2->id]);

        $response = $this->getJson("/api/campaigns?platform_id={$platform1->id}");

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    public function test_can_filter_campaigns_by_user_id(): void
    {
        $this->actingAsUser();
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        Campaign::factory()->count(3)->create(['user_id' => $user1->id]);
        Campaign::factory()->count(2)->create(['user_id' => $user2->id]);

        $response = $this->getJson("/api/campaigns?user_id={$user1->id}");

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    public function test_can_search_campaigns(): void
    {
        $this->actingAsUser();
        Campaign::factory()->create(['name' => 'Summer Sale 2026']);
        Campaign::factory()->create(['name' => 'Winter Promo']);

        $response = $this->getJson('/api/campaigns?search=Summer');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_can_update_campaign(): void
    {
        $this->actingAsUser();
        $campaign = Campaign::factory()->create();

        $response = $this->putJson("/api/campaigns/{$campaign->id}", [
            'name' => 'Updated Campaign X',
            'spend' => 5000,
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['name' => 'Updated Campaign X']);
    }

    public function test_can_soft_delete_campaign(): void
    {
        $this->actingAsUser();
        $campaign = Campaign::factory()->create();

        $response = $this->deleteJson("/api/campaigns/{$campaign->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted($campaign);
    }

    public function test_can_restore_soft_deleted_campaign(): void
    {
        $this->actingAsUser();
        $campaign = Campaign::factory()->create();
        $campaign->delete();

        $response = $this->putJson("/api/campaigns/{$campaign->id}/restore");

        $response->assertStatus(200);
        $this->assertNotSoftDeleted($campaign);
    }

    public function test_admin_can_hard_delete_campaign(): void
    {
        $admin = User::factory()->admin()->create();
        $this->actingAs($admin);
        $campaign = Campaign::factory()->create();

        $response = $this->deleteJson("/api/campaigns/{$campaign->id}/force");

        $response->assertStatus(200);
        $this->assertModelMissing($campaign);
    }

    public function test_standard_user_cannot_hard_delete_campaign(): void
    {
        $standard = User::factory()->create();
        $this->actingAs($standard);
        $campaign = Campaign::factory()->create();

        $response = $this->deleteJson("/api/campaigns/{$campaign->id}/force");

        $response->assertStatus(403);
    }
}
