<?php

namespace App\Repositories;

use App\Models\Campaign;
use Illuminate\Pagination\LengthAwarePaginator;

class CampaignRepository extends BaseRepository
{
    public function create(array $data): Campaign
    {
        return Campaign::create($data);
    }

    public function findById(int $id): ?Campaign
    {
        return Campaign::withTrashed()->find($id);
    }

    public function findAllPaginated(array $params): LengthAwarePaginator
    {
        $query = Campaign::query();

        if (!empty($params['platform_id'])) {
            $query->where('platform_id', $params['platform_id']);
        }

        if (!empty($params['user_id'])) {
            $query->where('user_id', $params['user_id']);
        }

        if (!empty($params['search'])) {
            $query->where('name', 'like', '%' . $params['search'] . '%');
        }

        $perPage = $params['per_page'] ?? 15;

        return $query->paginate($perPage);
    }

    public function update(Campaign $campaign, array $data): bool
    {
        return $campaign->update($data);
    }

    public function softDelete(Campaign $campaign): bool
    {
        return $campaign->delete();
    }

    public function forceDelete(Campaign $campaign): bool
    {
        return $campaign->forceDelete();
    }

    public function restore(Campaign $campaign): bool
    {
        return $campaign->restore();
    }
}
