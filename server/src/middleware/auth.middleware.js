import { verifyAccessToken } from '../utils/generateToken.js';
import userRepository from '../repositories/user.repository.js';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';

/**
 * Middleware to verify JWT access token from Authorization header.
 * Attaches decoded user to req.user.
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!token) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Access token is required');
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      const message = err.name === 'TokenExpiredError'
        ? 'Access token has expired'
        : 'Invalid access token';
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, message);
    }

    const user = await userRepository.findById(decoded.id);
    if (!user || !user.isActive) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not found or account deactivated');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware factory for role-based access control.
 * @param {...string} roles - Allowed roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Authentication required'));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(HTTP_STATUS.FORBIDDEN, 'You do not have permission to perform this action'));
    }
    next();
  };
};
