<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class UserService extends BaseService
{
    public function __construct(
        protected UserRepository $userRepository,
    ) {}

    public function create(array $data): User
    {
        $data['password'] = bcrypt($data['password']);

        $user = $this->userRepository->create($data);

        return $user->fresh();
    }

    public function findById(int $id): ?User
    {
        return $this->userRepository->findById($id);
    }

    public function findAllPaginated(array $params): LengthAwarePaginator
    {
        return $this->userRepository->findAllPaginated($params);
    }

    public function update(int $id, array $data): ?User
    {
        $user = $this->userRepository->findById($id);

        if (!$user) {
            return null;
        }

        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        $this->userRepository->update($user, $data);

        return $user->fresh();
    }

    public function softDelete(int $id): bool
    {
        $user = $this->userRepository->findById($id);

        if (!$user) {
            return false;
        }

        return $this->userRepository->softDelete($user);
    }

    public function forceDelete(int $id): bool
    {
        $user = $this->userRepository->findById($id);

        if (!$user) {
            return false;
        }

        return $this->userRepository->forceDelete($user);
    }

    public function restore(int $id): ?User
    {
        $user = $this->userRepository->findById($id);

        if (!$user) {
            return null;
        }

        $this->userRepository->restore($user);

        return $user->fresh();
    }
}
