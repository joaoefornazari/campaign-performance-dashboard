import { User } from '../entities/User.js';
import { PersonalAccessToken } from '../entities/PersonalAccessToken.js';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      tokenRecord?: PersonalAccessToken;
    }
  }
}
