import userRepository from '../repositories/user.repository.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/generateToken.js';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import logger from '../config/logger.js';

const authService = {
  /**
   * Register a new user.
   * @param {{ name, email, password }} data
   */
  register: async ({ name, email, password }) => {
    // Check if email already taken
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'Email is already registered');
    }

    const user = await userRepository.create({ name, email, password });
    logger.info(`New user registered: ${email}`);

    const payload = { id: user._id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await userRepository.setRefreshToken(user._id, refreshToken);

    return { user, accessToken, refreshToken };
  },

  /**
   * Authenticate user with email and password.
   * @param {{ email, password }} data
   */
  login: async ({ email, password }) => {
    const user = await userRepository.findByEmailWithPassword(email);
    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password');
    }

    if (!user.isActive) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Your account has been deactivated');
    }

    logger.info(`User logged in: ${email}`);

    const payload = { id: user._id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await userRepository.setRefreshToken(user._id, refreshToken);

    // Return user without sensitive fields
    const safeUser = await userRepository.findById(user._id);
    return { user: safeUser, accessToken, refreshToken };
  },

  /**
   * Logout: clear refresh token from database.
   * @param {string} userId
   */
  logout: async (userId) => {
    await userRepository.clearRefreshToken(userId);
    logger.info(`User logged out: ${userId}`);
  },

  /**
   * Refresh the access token using a valid refresh token.
   * @param {string} token - Refresh token from cookie
   */
  refresh: async (token) => {
    if (!token) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Refresh token missing');
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired refresh token');
    }

    const user = await userRepository.findByRefreshToken(token);
    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Refresh token reuse detected — please log in again');
    }

    const payload = { id: user._id, role: user.role };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    await userRepository.setRefreshToken(user._id, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken, user };
  },
};

export default authService;
