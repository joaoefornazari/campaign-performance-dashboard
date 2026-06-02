<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCampaignRequest;
use App\Http\Requests\UpdateCampaignRequest;
use App\Services\CampaignService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CampaignController extends Controller
{
    public function __construct(
        protected CampaignService $campaignService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $campaigns = $this->campaignService->findAllPaginated($request->only([
            'platform_id', 'user_id', 'search', 'per_page', 'page',
        ]));

        return response()->json($campaigns);
    }

    public function show(int $id): JsonResponse
    {
        $campaign = $this->campaignService->findById($id);

        if (!$campaign) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        return response()->json($campaign);
    }

    public function store(StoreCampaignRequest $request): JsonResponse
    {
        $campaign = $this->campaignService->create($request->validated());

        return response()->json($campaign, 201);
    }

    public function update(UpdateCampaignRequest $request, int $id): JsonResponse
    {
        $campaign = $this->campaignService->update($id, $request->validated());

        if (!$campaign) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        return response()->json($campaign);
    }

    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->campaignService->softDelete($id);

        if (!$deleted) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        return response()->json(['message' => 'Campaign soft-deleted successfully']);
    }

    public function forceDestroy(int $id): JsonResponse
    {
        Gate::authorize('force-delete');

        $deleted = $this->campaignService->forceDelete($id);

        if (!$deleted) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        return response()->json(['message' => 'Campaign hard-deleted successfully']);
    }

    public function restore(int $id): JsonResponse
    {
        $campaign = $this->campaignService->restore($id);

        if (!$campaign) {
            return response()->json(['message' => 'Campaign not found'], 404);
        }

        return response()->json($campaign);
    }
}
