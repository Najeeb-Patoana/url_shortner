import urlService from '../services/url.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import HTTP_STATUS from '../constants/httpStatus.js';

/**
 * @swagger
 * /api/urls:
 *   post:
 *     summary: Create a shortened URL
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [originalUrl]
 *             properties:
 *               originalUrl: { type: string, format: uri }
 *               customAlias: { type: string }
 *               expiresAt: { type: string, format: date-time }
 *               title: { type: string }
 *               tags: { type: array, items: { type: string } }
 *     responses:
 *       201:
 *         description: URL shortened successfully
 *       409:
 *         description: Alias already taken
 */
export const createUrl = async (req, res, next) => {
  try {
    const { originalUrl, customAlias, expiresAt, title, tags } = req.body;
    const url = await urlService.create(
      { originalUrl, customAlias, expiresAt, title, tags },
      req.user._id
    );
    res.status(HTTP_STATUS.CREATED).json(
      new ApiResponse(HTTP_STATUS.CREATED, url, 'URL shortened successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/urls:
 *   get:
 *     summary: Get all URLs for the authenticated user
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: ['-createdAt', 'createdAt', '-clicks', 'clicks'] }
 *     responses:
 *       200:
 *         description: URLs retrieved successfully
 */
export const getUrls = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', sort = '-createdAt', isActive, isFavorite } = req.query;

    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (isFavorite !== undefined) filter.isFavorite = isFavorite === 'true';

    const result = await urlService.getUserUrls(req.user._id, {
      page: Number(page),
      limit: Number(limit),
      search,
      sort,
      filter,
    });

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, result, 'URLs retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/urls/{id}:
 *   get:
 *     summary: Get a single URL by ID
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: URL retrieved
 *       404:
 *         description: URL not found
 */
export const getUrlById = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const url = await urlService.getUrlById(req.params.id, req.user._id, isAdmin);
    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, url, 'URL retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/urls/{id}:
 *   put:
 *     summary: Update a URL
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 */
export const updateUrl = async (req, res, next) => {
  try {
    const { originalUrl, customAlias, expiresAt, title, tags, isFavorite } = req.body;
    const isAdmin = req.user.role === 'admin';
    const url = await urlService.update(
      req.params.id,
      req.user._id,
      { originalUrl, customAlias, expiresAt, title, tags, isFavorite },
      isAdmin
    );
    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, url, 'URL updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/urls/{id}:
 *   delete:
 *     summary: Delete a URL
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 */
export const deleteUrl = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    await urlService.delete(req.params.id, req.user._id, isAdmin);
    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, null, 'URL deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/urls/{id}/status:
 *   patch:
 *     summary: Toggle URL active/inactive status
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 */
export const toggleStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const isAdmin = req.user.role === 'admin';
    const url = await urlService.toggleStatus(req.params.id, req.user._id, isActive, isAdmin);
    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, url, `URL ${isActive ? 'enabled' : 'disabled'} successfully`)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle favorite status of a URL.
 */
export const toggleFavorite = async (req, res, next) => {
  try {
    const url = await urlService.toggleFavorite(req.params.id, req.user._id);
    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, url, 'Favorite status updated')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Bulk delete URLs.
 */
export const bulkDelete = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const isAdmin = req.user.role === 'admin';
    const result = await urlService.bulkDelete(ids, req.user._id, isAdmin);
    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, result, 'URLs deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Bulk update URL status.
 */
export const bulkUpdateStatus = async (req, res, next) => {
  try {
    const { ids, isActive } = req.body;
    const result = await urlService.bulkUpdateStatus(ids, isActive);
    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, result, `URLs ${isActive ? 'enabled' : 'disabled'} successfully`)
    );
  } catch (error) {
    next(error);
  }
};
