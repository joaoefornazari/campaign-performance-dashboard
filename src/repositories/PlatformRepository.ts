import { AppDataSource } from '../database/data-source.js';
import { Platform } from '../entities/Platform.js';

export class PlatformRepository {
  private repo = AppDataSource.getRepository(Platform);

  async create(data: Partial<Platform>): Promise<Platform> {
    const platform = this.repo.create(data);
    return await this.repo.save(platform);
  }

  async findById(id: number): Promise<Platform | null> {
    return await this.repo.findOne({
      where: { id },
      withDeleted: true
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

    const queryBuilder = this.repo.createQueryBuilder('platform');

    if (search) {
      queryBuilder.where('platform.name ILIKE :search', { search: `%${search}%` });
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

  async update(platform: Platform, data: Partial<Platform>): Promise<Platform> {
    Object.assign(platform, data);
    return await this.repo.save(platform);
  }

  async softDelete(platform: Platform): Promise<boolean> {
    const result = await this.repo.softRemove(platform);
    return !!result;
  }

  async forceDelete(platform: Platform): Promise<boolean> {
    const result = await this.repo.remove(platform);
    return !!result;
  }

  async restore(platform: Platform): Promise<Platform> {
    platform.deleted_at = null;
    return await this.repo.save(platform);
  }
}
