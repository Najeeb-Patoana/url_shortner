import { body, param, query } from 'express-validator';

export const createUrlValidator = [
  body('originalUrl')
    .trim()
    .notEmpty().withMessage('Original URL is required')
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Please provide a valid URL starting with http:// or https://'),

  body('customAlias')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 }).withMessage('Alias must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9-_]+$/).withMessage('Alias can only contain letters, numbers, hyphens, and underscores'),

  body('expiresAt')
    .optional()
    .isISO8601().withMessage('Expiration date must be a valid ISO 8601 date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Expiration date must be in the future');
      }
      return true;
    }),

  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),

  body('tags')
    .optional()
    .isArray({ max: 10 }).withMessage('Tags must be an array with at most 10 items'),
];

export const updateUrlValidator = [
  param('id').isMongoId().withMessage('Invalid URL ID'),

  body('originalUrl')
    .optional()
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Please provide a valid URL starting with http:// or https://'),

  body('customAlias')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 }).withMessage('Alias must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9-_]+$/).withMessage('Alias can only contain letters, numbers, hyphens, and underscores'),

  body('expiresAt')
    .optional()
    .isISO8601().withMessage('Expiration date must be a valid ISO 8601 date'),

  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
];

export const urlIdValidator = [
  param('id').isMongoId().withMessage('Invalid URL ID'),
];

export const paginationValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer').toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100').toInt(),
  query('sort').optional().isIn(['-createdAt', 'createdAt', '-clicks', 'clicks', '-expiresAt']).withMessage('Invalid sort field'),
  query('search').optional().trim().isLength({ max: 100 }).withMessage('Search query too long'),
];
