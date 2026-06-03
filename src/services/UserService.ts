import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/UserRepository.js';
import { User } from '../entities/User.js';

export class UserService {
  constructor(private userRepository = new UserRepository()) {}

  async create(data: Partial<User>): Promise<User> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return await this.userRepository.create(data);
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async findAllPaginated(params: {
    search?: string;
    per_page?: number;
    page?: number;
  }) {
    return await this.userRepository.findAllPaginated(params);
  }

  async update(id: number, data: Partial<User>): Promise<User | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return null;
    }
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return await this.userRepository.update(user, data);
  }

  async softDelete(id: number): Promise<boolean> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return false;
    }
    return await this.userRepository.softDelete(user);
  }

  async forceDelete(id: number): Promise<boolean> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return false;
    }
    return await this.userRepository.forceDelete(user);
  }

  async restore(id: number): Promise<User | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return null;
    }
    return await this.userRepository.restore(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }
}
