import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../enums/UserRole.js';

export function adminGate(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== UserRole.Admin) {
    return res.status(403).json({ message: 'This action is unauthorized.' });
  }
  return next();
}
