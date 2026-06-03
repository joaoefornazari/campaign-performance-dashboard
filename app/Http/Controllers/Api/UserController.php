<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class UserController extends Controller
{
    public function __construct(
        protected UserService $userService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $users = $this->userService->findAllPaginated($request->only([
            'search', 'per_page', 'page',
        ]));

        return response()->json($users);
    }

    public function show(int $id): JsonResponse
    {
        $user = $this->userService->findById($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->userService->create($request->validated());

        return response()->json($user, 201);
    }

    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        $user = $this->userService->update($id, $request->validated());

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }

    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->userService->softDelete($id);

        if (!$deleted) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json(['message' => 'User soft-deleted successfully']);
    }

    public function forceDestroy(int $id): JsonResponse
    {
        Gate::authorize('force-delete');

        $deleted = $this->userService->forceDelete($id);

        if (!$deleted) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json(['message' => 'User hard-deleted successfully']);
    }

    public function restore(int $id): JsonResponse
    {
        $user = $this->userService->restore($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }
}
