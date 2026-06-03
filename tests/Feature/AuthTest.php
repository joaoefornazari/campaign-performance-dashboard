<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['user' => ['name', 'email'], 'token'])
            ->assertJsonFragment([
                'name' => $user->name,
                'email' => $user->email,
            ]);
    }

    public function test_user_cannot_login_with_invalid_password(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJsonFragment(['message' => 'Invalid credentials']);
    }

    public function test_login_returns_validation_errors(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => '',
            'password' => '',
        ]);

        $response->assertStatus(422);
    }

    public function test_user_can_logout(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('api-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/logout');

        $response->assertStatus(200)
            ->assertJsonFragment(['message' => 'Logged out successfully'])
            ->assertJsonStructure(['redirect']);
    }

    public function test_logout_requires_authentication(): void
    {
        $response = $this->postJson('/api/logout');

        $response->assertStatus(401);
    }

    public function test_login_rate_limit_is_enforced(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123'),
        ]);

        for ($i = 0; $i < 5; $i++) {
            $response = $this->postJson('/api/login', [
                'email' => $user->email,
                'password' => 'wrongpassword',
            ]);
            $response->assertStatus(401);
        }

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'wrongpassword',
        ]);
        $response->assertStatus(429);
    }
}
