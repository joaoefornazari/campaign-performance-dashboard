import { Request, Response } from 'express';
import { CompanyService } from '../services/CompanyService.js';
import { StockService } from '../services/StockService.js';
import { validate } from '../middlewares/Validation.js';
import { StoreCompanySchema, UpdateCompanySchema } from '../validations/schemas.js';
import { adminGate } from '../middlewares/AdminGate.js';

export class CompanyController {
  constructor(
    private readonly service = new CompanyService(),
    private readonly stockService = new StockService()
  ) {}

  async index(req: Request, res: Response) {
    const result = await this.service.findAllPaginated(req.query);
    return res.json(result);
  }

  async show(req: Request, res: Response) {
    const company = await this.service.findById(Number(req.params.id));
    if (!company) return res.status(404).json({ message: 'Company not found' });
    return res.json(company);
  }

  store = [
    validate(StoreCompanySchema),
    async (req: Request, res: Response) => {
      const company = await this.service.create(req.body);
      return res.status(201).json(company);
    },
  ];

  update = [
    validate(UpdateCompanySchema),
    async (req: Request, res: Response) => {
      const updated = await this.service.update(Number(req.params.id), req.body);
      if (!updated) return res.status(404).json({ message: 'Company not found' });
      return res.json(updated);
    },
  ];

  destroy = [
    async (req: Request, res: Response) => {
      const success = await this.service.softDelete(Number(req.params.id));
      if (!success) return res.status(404).json({ message: 'Company not found' });
      return res.status(204).send();
    },
  ];

  forceDelete = [
    adminGate,
    async (req: Request, res: Response) => {
      const success = await this.service.forceDelete(Number(req.params.id));
      if (!success) return res.status(404).json({ message: 'Company not found' });
      return res.status(204).send();
    },
  ];

  restore = [
    adminGate,
    async (req: Request, res: Response) => {
      const restored = await this.service.restore(Number(req.params.id));
      if (!restored) return res.status(404).json({ message: 'Company not found' });
      return res.json(restored);
    },
  ];

  lookupTicker = [
    async (req: Request, res: Response) => {
      const companyId = Number(req.params.id);
      const company = await this.service.findById(companyId);
      if (!company) return res.status(404).json({ message: 'Company not found' });

      try {
        const ticker = await this.stockService.lookupAndCacheTicker(companyId);
        if (!ticker) {
          return res.status(404).json({ message: 'No ticker symbol found for this company name.' });
        }
        return res.json({ ticker_symbol: ticker });
      } catch (err: any) {
        return res.status(500).json({ message: err.message || 'Failed to lookup ticker.' });
      }
    },
  ];

  fetchStock = [
    async (req: Request, res: Response) => {
      const companyId = Number(req.params.id);
      const company = await this.service.findById(companyId);
      if (!company) return res.status(404).json({ message: 'Company not found' });

      try {
        await this.stockService.fetchAndCacheForCompany(companyId);
        return res.json({ message: 'Stock data fetched and cached successfully.' });
      } catch (err: any) {
        return res.status(500).json({ message: err.message || 'Failed to fetch stock data.' });
      }
    },
  ];
}
