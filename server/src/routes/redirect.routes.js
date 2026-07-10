import { Router } from 'express';
import { redirect } from '../controllers/redirect.controller.js';
import { redirectLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();

router.get('/:shortCode', redirectLimiter, redirect);

export default router;
