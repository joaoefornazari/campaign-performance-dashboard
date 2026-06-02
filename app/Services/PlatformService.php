<?php

namespace App\Services;

use App\Models\Platform;
use App\Repositories\PlatformRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class PlatformService extends BaseService
{
    public function __construct(
        protected PlatformRepository $platformRepository,
    ) {}

    public function create(array $data): Platform
    {
        return $this->platformRepository->create($data);
    }

    public function findById(int $id): ?Platform
    {
        return $this->platformRepository->findById($id);
    }

    public function findAllPaginated(array $params): LengthAwarePaginator
    {
        return $this->platformRepository->findAllPaginated($params);
    }

    public function update(int $id, array $data): ?Platform
    {
        $platform = $this->platformRepository->findById($id);

        if (!$platform) {
            return null;
        }

        $this->platformRepository->update($platform, $data);

        return $platform->fresh();
    }

    public function softDelete(int $id): bool
    {
        $platform = $this->platformRepository->findById($id);

        if (!$platform) {
            return false;
        }

        return $this->platformRepository->softDelete($platform);
    }

    public function forceDelete(int $id): bool
    {
        $platform = $this->platformRepository->findById($id);

        if (!$platform) {
            return false;
        }

        return $this->platformRepository->forceDelete($platform);
    }

    public function restore(int $id): ?Platform
    {
        $platform = $this->platformRepository->findById($id);

        if (!$platform) {
            return null;
        }

        $this->platformRepository->restore($platform);

        return $platform->fresh();
    }
}
