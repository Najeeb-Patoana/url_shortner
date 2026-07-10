import { Router } from 'express';
import { getProfile, updateProfile, changePassword, getUserStats } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { updateProfileValidator, changePasswordValidator } from '../validators/user.validator.js';
import validate from '../middleware/validate.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfileValidator, validate, updateProfile);
router.put('/profile/password', changePasswordValidator, validate, changePassword);
router.get('/stats', getUserStats);

export default router;
