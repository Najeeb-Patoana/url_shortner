import { Router } from 'express';
import { getUrlAnalytics, getDashboard, exportAnalytics } from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { urlIdValidator } from '../validators/url.validator.js';
import validate from '../middleware/validate.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/dashboard', getDashboard);
router.get('/urls/:id/analytics', urlIdValidator, validate, getUrlAnalytics);
router.get('/urls/:id/analytics/export', urlIdValidator, validate, exportAnalytics);

export default router;
