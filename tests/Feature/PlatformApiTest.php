<?php

namespace Tests\Feature;

use App\Models\Platform;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlatformApiTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsUser(): User
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        return $user;
    }

    public function test_can_create_platform(): void
    {
        $this->actingAsUser();

        $response = $this->postJson('/api/platforms', [
            'name' => 'New Platform',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['id', 'name'])
            ->assertJsonFragment(['name' => 'New Platform']);
    }

    public function test_create_platform_requires_authentication(): void
    {
        $response = $this->postJson('/api/platforms', [
            'name' => 'New Platform',
        ]);

        $response->assertStatus(401);
    }

    public function test_create_platform_validates_name_length(): void
    {
        $this->actingAsUser();

        $response = $this->postJson('/api/platforms', [
            'name' => 'X',
        ]);

        $response->assertStatus(422);
    }

    public function test_can_get_platform_by_id(): void
    {
        $this->actingAsUser();
        $platform = Platform::factory()->create();

        $response = $this->getJson("/api/platforms/{$platform->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $platform->id]);
    }

    public function test_get_platform_returns_404_if_not_found(): void
    {
        $this->actingAsUser();

        $response = $this->getJson('/api/platforms/999');

        $response->assertStatus(404);
    }

    public function test_can_list_platforms(): void
    {
        $this->actingAsUser();
        Platform::factory()->count(5)->create();

        $response = $this->getJson('/api/platforms');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'current_page', 'last_page', 'per_page', 'total']);
    }

    public function test_can_update_platform(): void
    {
        $this->actingAsUser();
        $platform = Platform::factory()->create();

        $response = $this->putJson("/api/platforms/{$platform->id}", [
            'name' => 'Updated Platform',
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['name' => 'Updated Platform']);
    }

    public function test_can_soft_delete_platform(): void
    {
        $this->actingAsUser();
        $platform = Platform::factory()->create();

        $response = $this->deleteJson("/api/platforms/{$platform->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted($platform);
    }

    public function test_can_restore_soft_deleted_platform(): void
    {
        $this->actingAsUser();
        $platform = Platform::factory()->create();
        $platform->delete();

        $response = $this->putJson("/api/platforms/{$platform->id}/restore");

        $response->assertStatus(200);
        $this->assertNotSoftDeleted($platform);
    }

    public function test_admin_can_hard_delete_platform(): void
    {
        $admin = User::factory()->admin()->create();
        $this->actingAs($admin);
        $platform = Platform::factory()->create();

        $response = $this->deleteJson("/api/platforms/{$platform->id}/force");

        $response->assertStatus(200);
        $this->assertModelMissing($platform);
    }

    public function test_standard_user_cannot_hard_delete_platform(): void
    {
        $standard = User::factory()->create();
        $this->actingAs($standard);
        $platform = Platform::factory()->create();

        $response = $this->deleteJson("/api/platforms/{$platform->id}/force");

        $response->assertStatus(403);
    }
}
