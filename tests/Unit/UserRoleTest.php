<?php

namespace Tests\Unit;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserRoleTest extends TestCase
{
    use RefreshDatabase;

    public function test_enum_has_admin_and_standard_cases(): void
    {
        $this->assertEquals('admin', UserRole::Admin->value);
        $this->assertEquals('standard', UserRole::Standard->value);
    }

    public function test_user_has_default_standard_role(): void
    {
        $user = User::factory()->create();

        $this->assertEquals(UserRole::Standard, $user->role);
    }

    public function test_admin_user_factory_assigns_admin_role(): void
    {
        $user = User::factory()->admin()->create();

        $this->assertEquals(UserRole::Admin, $user->role);
    }

    public function test_role_is_cast_to_enum(): void
    {
        $user = User::factory()->create(['role' => UserRole::Admin]);

        $this->assertInstanceOf(UserRole::class, $user->role);
        $this->assertTrue($user->role === UserRole::Admin);
    }

    public function test_role_is_fillable(): void
    {
        $user = User::factory()->create(['role' => UserRole::Admin]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'role' => 'admin',
        ]);
    }
}
