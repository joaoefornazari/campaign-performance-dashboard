<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

class UserRoleAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_force_delete(): void
    {
        $admin = User::factory()->admin()->create();

        $this->assertTrue(Gate::forUser($admin)->allows('force-delete'));
    }

    public function test_standard_user_cannot_force_delete(): void
    {
        $user = User::factory()->create();

        $this->assertFalse(Gate::forUser($user)->allows('force-delete'));
    }

    public function test_admin_can_force_delete_denies_for_standard(): void
    {
        $admin = User::factory()->admin()->create();
        $standard = User::factory()->create();

        $this->assertTrue(Gate::forUser($admin)->allows('force-delete'));
        $this->assertFalse(Gate::forUser($standard)->allows('force-delete'));
    }
}
