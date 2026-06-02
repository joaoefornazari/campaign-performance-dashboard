<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class UserApiTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function test_can_create_user(): void
    {
        $payload = [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => 'password123',
        ];

        $response = $this->postJson('/api/users', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure(['id', 'name', 'email', 'role'])
            ->assertJsonFragment(['name' => $payload['name']]);
    }

    public function test_create_user_returns_validation_error(): void
    {
        $response = $this->postJson('/api/users', [
            'name' => '',
            'email' => 'not-an-email',
        ]);

        $response->assertStatus(422);
    }

    public function test_can_get_user_by_id(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson("/api/users/{$user->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $user->id]);
    }

    public function test_get_user_returns_404_if_not_found(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/users/999');

        $response->assertStatus(404);
    }

    public function test_get_user_requires_authentication(): void
    {
        $response = $this->getJson('/api/users/1');

        $response->assertStatus(401);
    }

    public function test_can_list_users(): void
    {
        User::factory()->count(5)->create();
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/users');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'current_page', 'last_page', 'per_page', 'total']);
    }

    public function test_can_search_users(): void
    {
        User::factory()->create(['name' => 'John Doe']);
        User::factory()->create(['name' => 'Jane Smith']);
        $user = User::factory()->create(['name' => 'SearchTarget']);

        $response = $this->actingAs($user)->getJson('/api/users?search=SearchTarget');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_can_update_user(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->putJson("/api/users/{$user->id}", [
            'name' => 'Updated Name',
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['name' => 'Updated Name']);
    }

    public function test_can_soft_delete_user(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->deleteJson("/api/users/{$user->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted($user);
    }

    public function test_can_restore_soft_deleted_user(): void
    {
        $user = User::factory()->create();
        $user->delete();

        $response = $this->actingAs($user)->putJson("/api/users/{$user->id}/restore");

        $response->assertStatus(200);
        $this->assertNotSoftDeleted($user);
    }

    public function test_admin_can_hard_delete_user(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->create();

        $response = $this->actingAs($admin)->deleteJson("/api/users/{$user->id}/force");

        $response->assertStatus(200);
        $this->assertModelMissing($user);
    }

    public function test_standard_user_cannot_hard_delete_user(): void
    {
        $standard = User::factory()->create();
        $user = User::factory()->create();

        $response = $this->actingAs($standard)->deleteJson("/api/users/{$user->id}/force");

        $response->assertStatus(403);
    }
}
