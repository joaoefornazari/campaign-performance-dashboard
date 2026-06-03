import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { UserController } from '../controllers/UserController.js';
import { PlatformController } from '../controllers/PlatformController.js';
import { CompanyController } from '../controllers/CompanyController.js';
import { CampaignController } from '../controllers/CampaignController.js';
import { authMiddleware } from '../middlewares/Auth.js';
import { loginRateLimiter } from '../middlewares/RateLimiter.js';
import { securityHeaders } from '../middlewares/SecurityHeaders.js';
import { errorHandler } from '../middlewares/ErrorHandler.js';

const router = Router();

// Global security headers
router.use(securityHeaders);

// Auth routes
router.post('/login', loginRateLimiter, (req, res) => new AuthController().login(req, res));
router.post('/logout', authMiddleware, (req, res) => new AuthController().logout(req, res));

// User routes (protected)
router.get('/users', authMiddleware, (req, res) => new UserController().index(req, res));
router.get('/users/:id', authMiddleware, (req, res) => new UserController().show(req, res));
router.post('/users', authMiddleware, ...new UserController().store);
router.put('/users/:id', authMiddleware, ...new UserController().update);
router.delete('/users/:id', authMiddleware, ...new UserController().destroy);
router.delete('/users/:id/force', authMiddleware, ...new UserController().forceDelete);
router.post('/users/:id/restore', authMiddleware, ...new UserController().restore);

// Platform routes (protected)
router.get('/platforms', authMiddleware, (req, res) => new PlatformController().index(req, res));
router.get('/platforms/:id', authMiddleware, (req, res) => new PlatformController().show(req, res));
router.post('/platforms', authMiddleware, ...new PlatformController().store);
router.put('/platforms/:id', authMiddleware, ...new PlatformController().update);
router.delete('/platforms/:id', authMiddleware, ...new PlatformController().destroy);
router.delete('/platforms/:id/force', authMiddleware, ...new PlatformController().forceDelete);
router.post('/platforms/:id/restore', authMiddleware, ...new PlatformController().restore);

// Company routes (protected)
router.get('/companies', authMiddleware, (req, res) => new CompanyController().index(req, res));
router.get('/companies/:id', authMiddleware, (req, res) => new CompanyController().show(req, res));
router.post('/companies', authMiddleware, ...new CompanyController().store);
router.put('/companies/:id', authMiddleware, ...new CompanyController().update);
router.delete('/companies/:id', authMiddleware, ...new CompanyController().destroy);
router.delete('/companies/:id/force', authMiddleware, ...new CompanyController().forceDelete);
router.post('/companies/:id/restore', authMiddleware, ...new CompanyController().restore);
router.post('/companies/:id/lookup-ticker', authMiddleware, ...new CompanyController().lookupTicker);
router.post('/companies/:id/fetch-stock', authMiddleware, ...new CompanyController().fetchStock);

// Campaign routes (protected)
router.get('/campaigns', authMiddleware, (req, res) => new CampaignController().index(req, res));
router.get('/campaigns/summary', authMiddleware, (req, res) => new CampaignController().summary(req, res));
router.get('/campaigns/:id', authMiddleware, (req, res) => new CampaignController().show(req, res));
router.post('/campaigns', authMiddleware, ...new CampaignController().store);
router.put('/campaigns/:id', authMiddleware, ...new CampaignController().update);
router.delete('/campaigns/:id', authMiddleware, ...new CampaignController().destroy);
router.delete('/campaigns/:id/force', authMiddleware, ...new CampaignController().forceDelete);
router.post('/campaigns/:id/restore', authMiddleware, ...new CampaignController().restore);

// CSV import route (protected)
router.post('/campaigns/import', authMiddleware, ...new CampaignController().importCsv);

// Error handling (must be last)
router.use(errorHandler);

export default router;
