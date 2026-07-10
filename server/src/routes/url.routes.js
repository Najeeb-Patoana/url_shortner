import { Router } from 'express';
import {
  createUrl,
  getUrls,
  getUrlById,
  updateUrl,
  deleteUrl,
  toggleStatus,
  toggleFavorite,
  bulkDelete,
  bulkUpdateStatus,
} from '../controllers/url.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import {
  createUrlValidator,
  updateUrlValidator,
  urlIdValidator,
  paginationValidator,
} from '../validators/url.validator.js';

const router = Router();

// All URL routes require authentication
router.use(authenticate);

router.post('/', createUrlValidator, validate, createUrl);
router.get('/', paginationValidator, validate, getUrls);
router.get('/:id', urlIdValidator, validate, getUrlById);
router.put('/:id', updateUrlValidator, validate, updateUrl);
router.delete('/:id', urlIdValidator, validate, deleteUrl);
router.patch('/:id/status', urlIdValidator, validate, toggleStatus);
router.patch('/:id/favorite', urlIdValidator, validate, toggleFavorite);

// Bulk operations
router.post('/bulk/delete', bulkDelete);
router.patch('/bulk/status', bulkUpdateStatus);

export default router;
