import { AppDataSource } from '../database/data-source.js';
import { Campaign } from '../entities/Campaign.js';

export class CampaignRepository {
  private repo = AppDataSource.getRepository(Campaign);

  async create(data: Partial<Campaign>): Promise<Campaign> {
    const campaign = this.repo.create(data);
    return await this.repo.save(campaign);
  }

  async findById(id: number): Promise<Campaign | null> {
    return await this.repo.findOne({
      where: { id },
      withDeleted: true
    });
  }

  async findAllPaginated(params: {
    platform_id?: number;
    user_id?: number;
    search?: string;
    per_page?: number;
    page?: number;
  }) {
    const search = params.search || '';
    const platform_id = params.platform_id;
    const user_id = params.user_id;
    const perPage = Number(params.per_page) || 15;
    const page = Number(params.page) || 1;
    const skip = (page - 1) * perPage;

    const queryBuilder = this.repo.createQueryBuilder('campaign')
      .leftJoinAndSelect('campaign.platform', 'platform')
      .leftJoinAndSelect('campaign.company', 'company');

    if (platform_id) {
      queryBuilder.andWhere('campaign.platform_id = :platform_id', { platform_id });
    }

    if (user_id) {
      queryBuilder.andWhere('campaign.user_id = :user_id', { user_id });
    }

    if (search) {
      queryBuilder.andWhere('campaign.name ILIKE :search', { search: `%${search}%` });
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

  async update(campaign: Campaign, data: Partial<Campaign>): Promise<Campaign> {
    Object.assign(campaign, data);
    return await this.repo.save(campaign);
  }

  async softDelete(campaign: Campaign): Promise<boolean> {
    const result = await this.repo.softRemove(campaign);
    return !!result;
  }

  async forceDelete(campaign: Campaign): Promise<boolean> {
    const result = await this.repo.remove(campaign);
    return !!result;
  }

  async restore(campaign: Campaign): Promise<Campaign> {
    campaign.deleted_at = null;
    return await this.repo.save(campaign);
  }

  async getSummaryByUserId(userId: number): Promise<{ total_spend: number; total_revenue: number } | null> {
    const result = await this.repo.createQueryBuilder('campaign')
      .select('SUM(campaign.spend)', 'total_spend')
      .addSelect('SUM(campaign.revenue)', 'total_revenue')
      .where('campaign.user_id = :userId', { userId })
      .getRawOne();

    if (!result || (!result.total_spend && !result.total_revenue)) {
      return null;
    }

    return {
      total_spend: Number(result.total_spend) || 0,
      total_revenue: Number(result.total_revenue) || 0,
    };
  }
}
