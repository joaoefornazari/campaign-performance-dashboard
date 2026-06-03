import { PlatformRepository } from '../repositories/PlatformRepository.js';
import { Platform } from '../entities/Platform.js';

export class PlatformService {
  constructor(private platformRepository = new PlatformRepository()) {}

  async create(data: Partial<Platform>): Promise<Platform> {
    return await this.platformRepository.create(data);
  }

  async findById(id: number): Promise<Platform | null> {
    return await this.platformRepository.findById(id);
  }

  async findAllPaginated(params: {
    search?: string;
    per_page?: number;
    page?: number;
  }) {
    return await this.platformRepository.findAllPaginated(params);
  }

  async update(id: number, data: Partial<Platform>): Promise<Platform | null> {
    const platform = await this.platformRepository.findById(id);
    if (!platform) {
      return null;
    }
    return await this.platformRepository.update(platform, data);
  }

  async softDelete(id: number): Promise<boolean> {
    const platform = await this.platformRepository.findById(id);
    if (!platform) {
      return false;
    }
    return await this.platformRepository.softDelete(platform);
  }

  async forceDelete(id: number): Promise<boolean> {
    const platform = await this.platformRepository.findById(id);
    if (!platform) {
      return false;
    }
    return await this.platformRepository.forceDelete(platform);
  }

  async restore(id: number): Promise<Platform | null> {
    const platform = await this.platformRepository.findById(id);
    if (!platform) {
      return null;
    }
    return await this.platformRepository.restore(platform);
  }
}
