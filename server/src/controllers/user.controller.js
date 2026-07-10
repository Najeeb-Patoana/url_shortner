import userService from '../services/user.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import HTTP_STATUS from '../constants/httpStatus.js';

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user._id);
    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, user, 'Profile retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update the authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await userService.updateProfile(req.user._id, { name });
    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, user, 'Profile updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Change authenticated user's password.
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await userService.changePassword(req.user._id, { currentPassword, newPassword });
    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, result, 'Password changed successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's own dashboard stats.
 */
export const getUserStats = async (req, res, next) => {
  try {
    const stats = await userService.getDashboardStats(req.user._id);
    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, stats, 'Stats retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};
