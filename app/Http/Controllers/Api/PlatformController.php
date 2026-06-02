<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePlatformRequest;
use App\Http\Requests\UpdatePlatformRequest;
use App\Services\PlatformService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class PlatformController extends Controller
{
    public function __construct(
        protected PlatformService $platformService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $platforms = $this->platformService->findAllPaginated($request->only([
            'search', 'per_page', 'page',
        ]));

        return response()->json($platforms);
    }

    public function show(int $id): JsonResponse
    {
        $platform = $this->platformService->findById($id);

        if (!$platform) {
            return response()->json(['message' => 'Platform not found'], 404);
        }

        return response()->json($platform);
    }

    public function store(StorePlatformRequest $request): JsonResponse
    {
        $platform = $this->platformService->create($request->validated());

        return response()->json($platform, 201);
    }

    public function update(UpdatePlatformRequest $request, int $id): JsonResponse
    {
        $platform = $this->platformService->update($id, $request->validated());

        if (!$platform) {
            return response()->json(['message' => 'Platform not found'], 404);
        }

        return response()->json($platform);
    }

    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->platformService->softDelete($id);

        if (!$deleted) {
            return response()->json(['message' => 'Platform not found'], 404);
        }

        return response()->json(['message' => 'Platform soft-deleted successfully']);
    }

    public function forceDestroy(int $id): JsonResponse
    {
        Gate::authorize('force-delete');

        $deleted = $this->platformService->forceDelete($id);

        if (!$deleted) {
            return response()->json(['message' => 'Platform not found'], 404);
        }

        return response()->json(['message' => 'Platform hard-deleted successfully']);
    }

    public function restore(int $id): JsonResponse
    {
        $platform = $this->platformService->restore($id);

        if (!$platform) {
            return response()->json(['message' => 'Platform not found'], 404);
        }

        return response()->json($platform);
    }
}
