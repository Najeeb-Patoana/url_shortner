import rateLimit from 'express-rate-limit';
import HTTP_STATUS from '../constants/httpStatus.js';

const rateLimitMessage = (message) => ({
  success: false,
  message,
  errors: [],
});

/**
 * General API rate limiter — applies to all /api routes.
 */
export const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitMessage('Too many requests, please try again later.'),
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
});

/**
 * Strict limiter for auth endpoints to prevent brute-force attacks.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitMessage('Too many authentication attempts. Please try again in 15 minutes.'),
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  skipSuccessfulRequests: true,
});

/**
 * Redirect rate limiter — prevents redirect abuse.
 */
export const redirectLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitMessage('Too many redirect requests.'),
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
});
