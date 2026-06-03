import { CampaignRepository } from '../repositories/CampaignRepository.js';
import { Campaign } from '../entities/Campaign.js';
import { PlatformService } from './PlatformService.js';
import { parse } from 'csv-parse/sync';

const EXPECTED_CSV_HEADERS = ['campaign_id', 'campaign_name', 'spend', 'revenue', 'conversions', 'platform'];

export class CampaignService {
  constructor(
    private campaignRepository = new CampaignRepository(),
    private platformService = new PlatformService()
  ) {}

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

  async importFromCsv(csvText: string, userId: number): Promise<{ message: string; count: number }> {
    let records: Record<string, string>[];
    try {
      records = parse(csvText, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
    } catch {
      throw { status: 422, message: 'Failed to parse CSV file. Please check the file format.' };
    }

    if (records.length === 0) {
      throw { status: 422, message: 'CSV file is empty.' };
    }

    const actualKeys = Object.keys(records[0]);
    if (JSON.stringify(actualKeys) !== JSON.stringify(EXPECTED_CSV_HEADERS)) {
      throw { status: 422, message: `Invalid CSV format. Expected columns: ${EXPECTED_CSV_HEADERS.join(', ')}` };
    }

    let importedCount = 0;

    for (const row of records) {
      const name = row.campaign_name.trim();
      if (name.length < 10 || name.length > 20) {
        throw {
          status: 422,
          message: `Campaign name "${name}" must be between 10 and 20 characters.`
        };
      }

      const spend = parseFloat(row.spend);
      const revenue = parseFloat(row.revenue);
      const conversions = parseInt(row.conversions, 10);

      if (isNaN(spend) || spend < 0) {
        throw { status: 422, message: `Invalid spend value for campaign "${name}".` };
      }
      if (isNaN(revenue) || revenue < 0) {
        throw { status: 422, message: `Invalid revenue value for campaign "${name}".` };
      }
      if (isNaN(conversions) || conversions < 0) {
        throw { status: 422, message: `Invalid conversions value for campaign "${name}".` };
      }

      const platformName = row.platform.trim();
      if (platformName.length < 2 || platformName.length > 20) {
        throw { status: 422, message: `Platform name "${platformName}" must be between 2 and 20 characters.` };
      }

      let platform = await this.platformService.findByName(platformName);
      if (!platform) {
        platform = await this.platformService.create({ name: platformName });
      }

      await this.campaignRepository.create({
        name,
        spend,
        revenue,
        conversions,
        platform_id: platform.id,
        user_id: userId,
        external_id: row.campaign_id.trim(),
      });

      importedCount++;
    }

    return {
      message: `${importedCount} campaign${importedCount !== 1 ? 's' : ''} imported successfully.`,
      count: importedCount
    };
  }
}
