import { CampaignRepository } from '../repositories/CampaignRepository.js';
import { Campaign } from '../entities/Campaign.js';

export class CampaignService {
  constructor(private campaignRepository = new CampaignRepository()) {}

  async create(data: Partial<Campaign>): Promise<Campaign> {
    return await this.campaignRepository.create(data);
  }

  async findById(id: number): Promise<Campaign | null> {
    return await this.campaignRepository.findById(id);
  }

  async findAllPaginated(params: {
    platform_id?: number;
    user_id?: number;
    search?: string;
    per_page?: number;
    page?: number;
  }) {
    return await this.campaignRepository.findAllPaginated(params);
  }

  async update(id: number, data: Partial<Campaign>): Promise<Campaign | null> {
    const campaign = await this.campaignRepository.findById(id);
    if (!campaign) {
      return null;
    }
    return await this.campaignRepository.update(campaign, data);
  }

  async softDelete(id: number): Promise<boolean> {
    const campaign = await this.campaignRepository.findById(id);
    if (!campaign) {
      return false;
    }
    return await this.campaignRepository.softDelete(campaign);
  }

  async forceDelete(id: number): Promise<boolean> {
    const campaign = await this.campaignRepository.findById(id);
    if (!campaign) {
      return false;
    }
    return await this.campaignRepository.forceDelete(campaign);
  }

  async restore(id: number): Promise<Campaign | null> {
    const campaign = await this.campaignRepository.findById(id);
    if (!campaign) {
      return null;
    }
    return await this.campaignRepository.restore(campaign);
  }
}
