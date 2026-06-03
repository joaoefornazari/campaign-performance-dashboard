import { Request, Response } from 'express';
import { UserService } from '../services/UserService.js';
import { validate } from '../middlewares/Validation.js';
import { StoreUserSchema, UpdateUserSchema } from '../validations/schemas.js';
import { adminGate } from '../middlewares/AdminGate.js';

export class UserController {
  constructor(private readonly userService = new UserService()) {}

  // GET /api/users
  async index(req: Request, res: Response) {
    const result = await this.userService.findAllPaginated(req.query);
    return res.json(result);
  }

  // GET /api/users/:id
  async show(req: Request, res: Response) {
    const user = await this.userService.findById(Number(req.params.id));
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  }

  // POST /api/users
  store = [
    validate(StoreUserSchema),
    async (req: Request, res: Response) => {
      const user = await this.userService.create(req.body);
      return res.status(201).json(user);
    },
  ];

  // PUT /api/users/:id
  update = [
    validate(UpdateUserSchema),
    async (req: Request, res: Response) => {
      const updated = await this.userService.update(Number(req.params.id), req.body);
      if (!updated) return res.status(404).json({ message: 'User not found' });
      return res.json(updated);
    },
  ];

  // DELETE /api/users/:id (soft delete)
  destroy = [
    async (req: Request, res: Response) => {
      const success = await this.userService.softDelete(Number(req.params.id));
      if (!success) return res.status(404).json({ message: 'User not found' });
      return res.status(204).send();
    },
  ];

  // DELETE /api/users/:id/force (hard delete) - admin only
  forceDelete = [
    adminGate,
    async (req: Request, res: Response) => {
      const success = await this.userService.forceDelete(Number(req.params.id));
      if (!success) return res.status(404).json({ message: 'User not found' });
      return res.status(204).send();
    },
  ];

  // POST /api/users/:id/restore - admin only
  restore = [
    adminGate,
    async (req: Request, res: Response) => {
      const restored = await this.userService.restore(Number(req.params.id));
      if (!restored) return res.status(404).json({ message: 'User not found' });
      return res.json(restored);
    },
  ];
}
