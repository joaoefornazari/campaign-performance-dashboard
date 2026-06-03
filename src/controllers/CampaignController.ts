import { Request, Response } from 'express';
import { CampaignService } from '../services/CampaignService.js';
import { validate } from '../middlewares/Validation.js';
import {
    StoreCampaignSchema,
    UpdateCampaignSchema,
} from '../validations/schemas.js';
import { adminGate } from '../middlewares/AdminGate.js';

export class CampaignController {
    constructor(private readonly service = new CampaignService()) { }

    async index(req: Request, res: Response) {
        const queryParams: any = { ...req.query };
        if (!queryParams.user_id) {
            queryParams.user_id = req.user!.id;
        }
        const result = await this.service.findAllPaginated(queryParams);
        return res.json(result);
    }

    async show(req: Request, res: Response) {
        const campaign = await this.service.findById(Number(req.params.id));
        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
        return res.json(campaign);
    }

    store = [
        validate(StoreCampaignSchema),
        async (req: Request, res: Response) => {
            const campaign = await this.service.create(req.body);
            return res.status(201).json(campaign);
        },
    ];

    update = [
        validate(UpdateCampaignSchema),
        async (req: Request, res: Response) => {
            const updated = await this.service.update(Number(req.params.id), req.body);
            if (!updated) return res.status(404).json({ message: 'Campaign not found' });
            return res.json(updated);
        },
    ];

    destroy = [
        async (req: Request, res: Response) => {
            const success = await this.service.softDelete(Number(req.params.id));
            if (!success) return res.status(404).json({ message: 'Campaign not found' });
            return res.status(204).send();
        },
    ];

    forceDelete = [
        adminGate,
        async (req: Request, res: Response) => {
            const success = await this.service.forceDelete(Number(req.params.id));
            if (!success) return res.status(404).json({ message: 'Campaign not found' });
            return res.status(204).send();
        },
    ];

    restore = [
        adminGate,
        async (req: Request, res: Response) => {
            const restored = await this.service.restore(Number(req.params.id));
            if (!restored) return res.status(404).json({ message: 'Campaign not found' });
            return res.json(restored);
        },
    ];

    async summary(req: Request, res: Response) {
        const result = await this.service.getSummary(req.user!.id);
        return res.json(result);
    }

    importCsv = [
        async (req: Request, res: Response) => {
            try {
                const { csv } = req.body;
                if (!csv || typeof csv !== 'string') {
                    return res.status(422).json({ message: 'Invalid request. Expected a "csv" field with CSV text.' });
                }

                const result = await this.service.importFromCsv(csv, req.user!.id);
                return res.status(201).json(result);
            } catch (err: any) {
                if (err.status && err.message) {
                    return res.status(err.status).json({ message: err.message });
                }
                throw err;
            }
        },
    ];
}
