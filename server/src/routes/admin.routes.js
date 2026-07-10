import { Router } from 'express';
import {
  getAdminStats,
  getAllUsers,
  getAllUrls,
  adminDeleteUrl,
  adminToggleStatus,
} from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { ROLES } from '../constants/roles.js';
import { paginationValidator } from '../validators/url.validator.js';
import validate from '../middleware/validate.middleware.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/stats', getAdminStats);
router.get('/users', paginationValidator, validate, getAllUsers);
router.get('/urls', paginationValidator, validate, getAllUrls);
router.delete('/urls/:id', adminDeleteUrl);
router.patch('/urls/:id/status', adminToggleStatus);

export default router;
