import { CampaignRepository } from '../repositories/CampaignRepository.js';
import { Campaign } from '../entities/Campaign.js';
import { PlatformService } from './PlatformService.js';
import { CompanyService } from './CompanyService.js';
import { StockService } from './StockService.js';
import { parse } from 'csv-parse/sync';

const EXPECTED_CSV_HEADERS = ['campaign_id', 'campaign_name', 'spend', 'revenue', 'conversions', 'platform', 'company', 'start_date'];

export class CampaignService {
  constructor(
    private campaignRepository = new CampaignRepository(),
    private platformService = new PlatformService(),
    private companyService = new CompanyService(),
    private stockService = new StockService()
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
    const result = await this.campaignRepository.findAllPaginated(params);

    for (const campaign of result.data) {
      const company = (campaign as any).company;
      if (company?.ticker_symbol && campaign.start_datetime) {
        const variation = await this.stockService.getVariation(
          company.ticker_symbol,
          campaign.start_datetime
        );
        (campaign as any).stock_variation = variation.variation;
      } else {
        (campaign as any).stock_variation = null;
      }
    }

    return result;
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

  async getSummary(userId: number): Promise<{ total_spend: number; total_revenue: number; overall_roas: number | null }> {
    const data = await this.campaignRepository.getSummaryByUserId(userId);
    if (!data) {
      return { total_spend: 0, total_revenue: 0, overall_roas: null };
    }
    const overall_roas = data.total_spend > 0 ? data.total_revenue / data.total_spend : null;
    return { ...data, overall_roas };
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
      if (name.length < 10 || name.length > 200) {
        throw {
          status: 422,
          message: `Campaign name "${name}" must be between 10 and 200 characters.`
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

      let startDatetime: Date;
      const rawDate = (row.start_date || '').trim();
      if (rawDate) {
        startDatetime = new Date(rawDate);
        if (isNaN(startDatetime.getTime())) {
          throw { status: 422, message: `Invalid start_date "${rawDate}" for campaign "${name}".` };
        }
      } else {
        startDatetime = new Date();
      }

      const platformName = row.platform.trim();
      if (platformName.length < 2 || platformName.length > 20) {
        throw { status: 422, message: `Platform name "${platformName}" must be between 2 and 20 characters.` };
      }

      let platform = await this.platformService.findByName(platformName);
      if (!platform) {
        platform = await this.platformService.create({ name: platformName });
      }

      let companyId: number | undefined;
      const companyName = (row.company || '').trim();
      if (companyName) {
        const company = await this.companyService.findOrCreateByName(companyName);
        companyId = company.id;
      }

      await this.campaignRepository.create({
        name,
        spend,
        revenue,
        conversions,
        platform_id: platform.id,
        user_id: userId,
        company_id: companyId,
        external_id: row.campaign_id.trim(),
        start_datetime: startDatetime,
      });

      if (companyId && process.env.NODE_ENV !== 'test') {
        try {
          await this.stockService.fetchAndCacheForCompany(companyId);
          await new Promise(r => setTimeout(r, 1500));
        } catch (err) {
          console.error(`[CampaignService] Failed to fetch stock data for company ${companyId}:`, err);
        }
      }

      importedCount++;
    }

    return {
      message: `${importedCount} campaign${importedCount !== 1 ? 's' : ''} imported successfully.`,
      count: importedCount
    };
  }
}
