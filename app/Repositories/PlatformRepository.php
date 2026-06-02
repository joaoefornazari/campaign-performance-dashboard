<?php

namespace App\Repositories;

use App\Models\Platform;
use Illuminate\Pagination\LengthAwarePaginator;

class PlatformRepository extends BaseRepository
{
    public function create(array $data): Platform
    {
        return Platform::create($data);
    }

    public function findById(int $id): ?Platform
    {
        return Platform::withTrashed()->find($id);
    }

    public function findAllPaginated(array $params): LengthAwarePaginator
    {
        $query = Platform::query();

        if (!empty($params['search'])) {
            $query->where('name', 'like', '%' . $params['search'] . '%');
        }

        $perPage = $params['per_page'] ?? 15;

        return $query->paginate($perPage);
    }

    public function update(Platform $platform, array $data): bool
    {
        return $platform->update($data);
    }

    public function softDelete(Platform $platform): bool
    {
        return $platform->delete();
    }

    public function forceDelete(Platform $platform): bool
    {
        return $platform->forceDelete();
    }

    public function restore(Platform $platform): bool
    {
        return $platform->restore();
    }
}
