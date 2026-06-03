import { CompanyRepository } from '../repositories/CompanyRepository.js';
import { Company } from '../entities/Company.js';

export class CompanyService {
  constructor(private companyRepository = new CompanyRepository()) {}

  async create(data: Partial<Company>): Promise<Company> {
    return await this.companyRepository.create(data);
  }

  async findById(id: number): Promise<Company | null> {
    return await this.companyRepository.findById(id);
  }

  async findByName(name: string): Promise<Company | null> {
    return await this.companyRepository.findByName(name);
  }

  async findOrCreateByName(name: string): Promise<Company> {
    const existing = await this.findByName(name);
    if (existing) return existing;
    return await this.create({ name });
  }

  async findAllPaginated(params: {
    search?: string;
    per_page?: number;
    page?: number;
  }) {
    return await this.companyRepository.findAllPaginated(params);
  }

  async update(id: number, data: Partial<Company>): Promise<Company | null> {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      return null;
    }
    return await this.companyRepository.update(company, data);
  }

  async softDelete(id: number): Promise<boolean> {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      return false;
    }
    return await this.companyRepository.softDelete(company);
  }

  async forceDelete(id: number): Promise<boolean> {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      return false;
    }
    return await this.companyRepository.forceDelete(company);
  }

  async restore(id: number): Promise<Company | null> {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      return null;
    }
    return await this.companyRepository.restore(company);
  }
}
