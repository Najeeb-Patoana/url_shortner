import analyticsService from '../services/analytics.service.js';
import urlService from '../services/url.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';

/**
 * @swagger
 * /api/urls/{id}/analytics:
 *   get:
 *     summary: Get analytics for a specific URL
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Analytics data retrieved
 *       404:
 *         description: URL not found
 */
export const getUrlAnalytics = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    // Verify ownership first
    const url = await urlService.getUrlById(req.params.id, req.user._id, isAdmin);
    if (!url) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'URL not found');
    }

    const analytics = await analyticsService.getUrlAnalytics(url._id);
    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, { url, analytics }, 'Analytics retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved
 */
export const getDashboard = async (req, res, next) => {
  try {
    const analytics = await analyticsService.getDashboardAnalytics();
    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, analytics, 'Dashboard data retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Export analytics for a URL as JSON (CSV conversion happens on client).
 */
export const exportAnalytics = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const url = await urlService.getUrlById(req.params.id, req.user._id, isAdmin);
    if (!url) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'URL not found');
    }

    const data = await analyticsService.exportAnalytics(url._id);
    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, data, 'Export data ready')
    );
  } catch (error) {
    next(error);
  }
};
