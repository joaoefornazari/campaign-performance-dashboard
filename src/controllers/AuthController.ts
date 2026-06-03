import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { UserService } from '../services/UserService.js';
import { AppDataSource } from '../database/data-source.js';
import { PersonalAccessToken } from '../entities/PersonalAccessToken.js';

export class AuthController {
  constructor(private readonly userService = new UserService()) {}

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Generate token similar to Laravel Sanctum format "id|plain"
    const tokenPlain = crypto.randomBytes(40).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(tokenPlain).digest('hex');
    const tokenRecord = new PersonalAccessToken();
    tokenRecord.tokenable_id = user.id;
    tokenRecord.tokenable_type = 'App\\Models\\User';
    tokenRecord.name = 'api-token';
    tokenRecord.token = tokenHash;
    await AppDataSource.getRepository(PersonalAccessToken).save(tokenRecord);
    const token = `${tokenRecord.id}|${tokenPlain}`;
    return res.json({ user: { name: user.name, email: user.email, role: user.role }, token });
  }

  async logout(req: Request, res: Response) {
    // @ts-ignore – tokenRecord added by auth middleware
    const tokenRecord = (req as any).tokenRecord as PersonalAccessToken | undefined;
    if (tokenRecord) {
      await AppDataSource.getRepository(PersonalAccessToken).delete(tokenRecord.id);
    }
    return res.json({ message: 'Logged out successfully' });
  }
}
