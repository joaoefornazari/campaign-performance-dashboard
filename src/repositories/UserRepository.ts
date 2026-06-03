import { AppDataSource } from '../database/data-source.js';
import { User } from '../entities/User.js';

export class UserRepository {
  private repo = AppDataSource.getRepository(User);

  async create(data: Partial<User>): Promise<User> {
    const user = this.repo.create(data);
    return await this.repo.save(user);
  }

  async findById(id: number): Promise<User | null> {
    return await this.repo.findOne({
      where: { id },
      withDeleted: true
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repo.findOne({
      where: { email }
    });
  }

  async findAllPaginated(params: {
    search?: string;
    per_page?: number;
    page?: number;
  }) {
    const search = params.search || '';
    const perPage = Number(params.per_page) || 15;
    const page = Number(params.page) || 1;
    const skip = (page - 1) * perPage;

    const queryBuilder = this.repo.createQueryBuilder('user');

    if (search) {
      queryBuilder.where('user.name ILIKE :search', { search: `%${search}%` });
    }

    const [data, total] = await queryBuilder
      .take(perPage)
      .skip(skip)
      .getManyAndCount();

    const lastPage = Math.ceil(total / perPage);

    return {
      data,
      current_page: page,
      last_page: lastPage,
      per_page: perPage,
      total
    };
  }

  async update(user: User, data: Partial<User>): Promise<User> {
    Object.assign(user, data);
    return await this.repo.save(user);
  }

  async softDelete(user: User): Promise<boolean> {
    const result = await this.repo.softRemove(user);
    return !!result;
  }

  async forceDelete(user: User): Promise<boolean> {
    const result = await this.repo.remove(user);
    return !!result;
  }

  async restore(user: User): Promise<User> {
    user.deleted_at = null;
    return await this.repo.save(user);
  }
}
