import { Router } from 'express';
import { getUrlAnalytics, getDashboard, exportAnalytics } from '../controllers/analytics.controller.js';
import { urlIdValidator } from '../validators/url.validator.js';
import validate from '../middleware/validate.middleware.js';

const router = Router();

// No authentication required — public analytics
router.get('/dashboard', getDashboard);
router.get('/urls/:id/analytics', urlIdValidator, validate, getUrlAnalytics);
router.get('/urls/:id/analytics/export', urlIdValidator, validate, exportAnalytics);

export default router;
