import { Request, Response } from 'express';
import { PlatformService } from '../services/PlatformService.js';
import { validate } from '../middlewares/Validation.js';
import { StorePlatformSchema, UpdatePlatformSchema } from '../validations/schemas.js';
import { adminGate } from '../middlewares/AdminGate.js';

export class PlatformController {
  constructor(private readonly service = new PlatformService()) {}

  // GET /platforms
  async index(req: Request, res: Response) {
    const result = await this.service.findAllPaginated(req.query);
    return res.json(result);
  }

  // GET /platforms/:id
  async show(req: Request, res: Response) {
    const platform = await this.service.findById(Number(req.params.id));
    if (!platform) return res.status(404).json({ message: 'Platform not found' });
    return res.json(platform);
  }

  // POST /platforms
  store = [
    validate(StorePlatformSchema),
    async (req: Request, res: Response) => {
      const platform = await this.service.create(req.body);
      return res.status(201).json(platform);
    },
  ];

  // PUT /platforms/:id
  update = [
    validate(UpdatePlatformSchema),
    async (req: Request, res: Response) => {
      const updated = await this.service.update(Number(req.params.id), req.body);
      if (!updated) return res.status(404).json({ message: 'Platform not found' });
      return res.json(updated);
    },
  ];

  // DELETE /platforms/:id (soft delete)
  destroy = [
    async (req: Request, res: Response) => {
      const success = await this.service.softDelete(Number(req.params.id));
      if (!success) return res.status(404).json({ message: 'Platform not found' });
      return res.status(204).send();
    },
  ];

  // DELETE /platforms/:id/force (hard delete) - admin only
  forceDelete = [
    adminGate,
    async (req: Request, res: Response) => {
      const success = await this.service.forceDelete(Number(req.params.id));
      if (!success) return res.status(404).json({ message: 'Platform not found' });
      return res.status(204).send();
    },
  ];

  // POST /platforms/:id/restore - admin only
  restore = [
    adminGate,
    async (req: Request, res: Response) => {
      const restored = await this.service.restore(Number(req.params.id));
      if (!restored) return res.status(404).json({ message: 'Platform not found' });
      return res.json(restored);
    },
  ];
}
