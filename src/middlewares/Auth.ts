import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../database/data-source.js';
import { PersonalAccessToken } from '../entities/PersonalAccessToken.js';
import { User } from '../entities/User.js';
import crypto from 'crypto';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthenticated.' });
  }

  const tokenStr = authHeader.substring(7);
  if (!tokenStr) {
    return res.status(401).json({ message: 'Unauthenticated.' });
  }

  try {
    const tokenRepo = AppDataSource.getRepository(PersonalAccessToken);
    let tokenRecord: PersonalAccessToken | null = null;

    if (tokenStr.includes('|')) {
      const [idStr, plainToken] = tokenStr.split('|');
      const id = parseInt(idStr, 10);
      if (!isNaN(id)) {
        const record = await tokenRepo.findOne({ where: { id } });
        if (record) {
          const hashedToken = crypto.createHash('sha256').update(plainToken).digest('hex');
          if (record.token === hashedToken || record.token === plainToken) {
            tokenRecord = record;
          }
        }
      }
    } else {
      const hashedToken = crypto.createHash('sha256').update(tokenStr).digest('hex');
      tokenRecord = await tokenRepo.findOne({
        where: [
          { token: tokenStr },
          { token: hashedToken }
        ]
      });
    }

    if (!tokenRecord) {
      return res.status(401).json({ message: 'Unauthenticated.' });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: tokenRecord.tokenable_id }
    });

    if (!user) {
      return res.status(401).json({ message: 'Unauthenticated.' });
    }

    req.user = user;
    req.tokenRecord = tokenRecord;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthenticated.' });
  }
}
