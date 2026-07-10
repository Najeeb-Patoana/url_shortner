import userRepository from '../repositories/user.repository.js';
import urlRepository from '../repositories/url.repository.js';
import analyticsRepository from '../repositories/analytics.repository.js';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';

const userService = {
  /**
   * Get user profile by ID.
   */
  getProfile: async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }
    return user;
  },

  /**
   * Update user profile (name).
   */
  updateProfile: async (userId, { name }) => {
    const user = await userRepository.updateById(userId, { name });
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }
    return user;
  },

  /**
   * Change user password.
   */
  changePassword: async (userId, { currentPassword, newPassword }) => {
    const user = await userRepository.findByIdWithPassword(userId);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  },

  /**
   * Get user dashboard stats.
   */
  getDashboardStats: async (userId) => {
    const [totalUrls, activeUrls, disabledUrls] = await Promise.all([
      urlRepository.countByOwner(userId),
      urlRepository.countByOwner(userId, { isActive: true }),
      urlRepository.countByOwner(userId, { isActive: false }),
    ]);

    const expiredUrls = await urlRepository.countByOwner(userId, {
      expiresAt: { $lt: new Date() },
    });

    return { totalUrls, activeUrls, disabledUrls, expiredUrls };
  },

  /**
   * Admin: get all users.
   */
  getAllUsers: async ({ page, limit, search } = {}) => {
    const [users, total] = await Promise.all([
      userRepository.findAll({ page, limit, search }),
      userRepository.count(search),
    ]);
    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  /**
   * Admin: get platform dashboard stats.
   */
  getAdminStats: async () => {
    const [totalUsers, totalUrls, activeUrls, disabledUrls, totalClicks] = await Promise.all([
      userRepository.count(),
      urlRepository.count(),
      urlRepository.count({ isActive: true }),
      urlRepository.count({ isActive: false }),
      analyticsRepository.getTotalClicks(),
    ]);

    const expiredUrls = await urlRepository.count({
      expiresAt: { $lt: new Date(), $ne: null },
    });

    return { totalUsers, totalUrls, activeUrls, disabledUrls, expiredUrls, totalClicks };
  },
};

export default userService;
