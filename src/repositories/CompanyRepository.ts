import { AppDataSource } from '../database/data-source.js';
import { Company } from '../entities/Company.js';
import { ILike } from 'typeorm';

export class CompanyRepository {
  private repo = AppDataSource.getRepository(Company);

  async findByName(name: string): Promise<Company | null> {
    return await this.repo.findOne({
      where: { name: ILike(name) }
    });
  }

  async create(data: Partial<Company>): Promise<Company> {
    const company = this.repo.create(data);
    return await this.repo.save(company);
  }

  async findById(id: number): Promise<Company | null> {
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

    const queryBuilder = this.repo.createQueryBuilder('company');

    if (search) {
      queryBuilder.where('company.name ILIKE :search', { search: `%${search}%` });
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

  async update(company: Company, data: Partial<Company>): Promise<Company> {
    Object.assign(company, data);
    return await this.repo.save(company);
  }

  async softDelete(company: Company): Promise<boolean> {
    const result = await this.repo.softRemove(company);
    return !!result;
  }

  async forceDelete(company: Company): Promise<boolean> {
    const result = await this.repo.remove(company);
    return !!result;
  }

  async restore(company: Company): Promise<Company> {
    company.deleted_at = null;
    return await this.repo.save(company);
  }
}
