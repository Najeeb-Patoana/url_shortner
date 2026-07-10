import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';

/**
 * Middleware to collect and return express-validator results.
 * Place this AFTER validator chains in route definitions.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return next(new ApiError(HTTP_STATUS.BAD_REQUEST, 'Validation failed', formattedErrors));
  }
  next();
};

export default validate;
