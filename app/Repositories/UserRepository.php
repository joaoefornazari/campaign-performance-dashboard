<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class UserRepository extends BaseRepository
{
    public function create(array $data): User
    {
        return User::create($data);
    }

    public function findById(int $id): ?User
    {
        return User::withTrashed()->find($id);
    }

    public function findAllPaginated(array $params): LengthAwarePaginator
    {
        $query = User::query();

        if (!empty($params['search'])) {
            $query->where('name', 'like', '%' . $params['search'] . '%');
        }

        $perPage = $params['per_page'] ?? 15;

        return $query->paginate($perPage);
    }

    public function update(User $user, array $data): bool
    {
        return $user->update($data);
    }

    public function softDelete(User $user): bool
    {
        return $user->delete();
    }

    public function forceDelete(User $user): bool
    {
        return $user->forceDelete();
    }

    public function restore(User $user): bool
    {
        return $user->restore();
    }
}
