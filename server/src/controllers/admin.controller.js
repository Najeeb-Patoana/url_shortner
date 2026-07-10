import userService from '../services/user.service.js';
import urlService from '../services/url.service.js';
import analyticsService from '../services/analytics.service.js';
import urlRepository from '../repositories/url.repository.js';
import ApiResponse from '../utils/ApiResponse.js';
import HTTP_STATUS from '../constants/httpStatus.js';

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get platform-wide admin statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin stats retrieved
 *       403:
 *         description: Forbidden
 */
export const getAdminStats = async (req, res, next) => {
  try {
    const [userStats, analyticsData, topUrls] = await Promise.all([
      userService.getAdminStats(),
      analyticsService.getDashboardAnalytics(),
      urlRepository.findTopUrls(10),
    ]);

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, { ...userStats, ...analyticsData, topUrls }, 'Admin stats retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const result = await userService.getAllUsers({
      page: Number(page),
      limit: Number(limit),
      search,
    });
    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, result, 'Users retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/admin/urls:
 *   get:
 *     summary: Get all URLs (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
export const getAllUrls = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', sort = '-createdAt', isActive } = req.query;
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const result = await urlService.getAllUrls({
      page: Number(page),
      limit: Number(limit),
      search,
      sort,
      filter,
    });
    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, result, 'All URLs retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Admin delete any URL.
 */
export const adminDeleteUrl = async (req, res, next) => {
  try {
    await urlService.delete(req.params.id, null, true);
    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, null, 'URL deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Admin toggle URL status.
 */
export const adminToggleStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const url = await urlService.toggleStatus(req.params.id, null, isActive, true);
    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, url, `URL ${isActive ? 'enabled' : 'disabled'}`)
    );
  } catch (error) {
    next(error);
  }
};
