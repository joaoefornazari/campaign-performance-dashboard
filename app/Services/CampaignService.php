<?php

namespace App\Services;

use App\Models\Campaign;
use App\Repositories\CampaignRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class CampaignService extends BaseService
{
    public function __construct(
        protected CampaignRepository $campaignRepository,
    ) {}

    public function create(array $data): Campaign
    {
        return $this->campaignRepository->create($data);
    }

    public function findById(int $id): ?Campaign
    {
        return $this->campaignRepository->findById($id);
    }

    public function findAllPaginated(array $params): LengthAwarePaginator
    {
        return $this->campaignRepository->findAllPaginated($params);
    }

    public function update(int $id, array $data): ?Campaign
    {
        $campaign = $this->campaignRepository->findById($id);

        if (!$campaign) {
            return null;
        }

        $this->campaignRepository->update($campaign, $data);

        return $campaign->fresh();
    }

    public function softDelete(int $id): bool
    {
        $campaign = $this->campaignRepository->findById($id);

        if (!$campaign) {
            return false;
        }

        return $this->campaignRepository->softDelete($campaign);
    }

    public function forceDelete(int $id): bool
    {
        $campaign = $this->campaignRepository->findById($id);

        if (!$campaign) {
            return false;
        }

        return $this->campaignRepository->forceDelete($campaign);
    }

    public function restore(int $id): ?Campaign
    {
        $campaign = $this->campaignRepository->findById($id);

        if (!$campaign) {
            return null;
        }

        $this->campaignRepository->restore($campaign);

        return $campaign->fresh();
    }
}
