import urlService from '../services/url.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import HTTP_STATUS from '../constants/httpStatus.js';

/**
 * Create a shortened URL — no authentication required.
 */
export const createUrl = async (req, res, next) => {
  try {
    const { originalUrl, customAlias, expiresAt, title, tags } = req.body;
    const url = await urlService.create({ originalUrl, customAlias, expiresAt, title, tags });
    res.status(HTTP_STATUS.CREATED).json(
      new ApiResponse(HTTP_STATUS.CREATED, url, 'URL shortened successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all URLs — returns all URLs (no user filter).
 */
export const getUrls = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', sort = '-createdAt', isActive, isFavorite } = req.query;

    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (isFavorite !== undefined) filter.isFavorite = isFavorite === 'true';

    const result = await urlService.getAllUrls({
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
 * Get a single URL by ID.
 */
export const getUrlById = async (req, res, next) => {
  try {
    const url = await urlService.getUrlById(req.params.id);
    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, url, 'URL retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update a URL.
 */
export const updateUrl = async (req, res, next) => {
  try {
    const { originalUrl, customAlias, expiresAt, title, tags, isFavorite } = req.body;
    const url = await urlService.update(req.params.id, { originalUrl, customAlias, expiresAt, title, tags, isFavorite });
    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, url, 'URL updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a URL.
 */
export const deleteUrl = async (req, res, next) => {
  try {
    await urlService.delete(req.params.id);
    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, null, 'URL deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle URL active/inactive status.
 */
export const toggleStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const url = await urlService.toggleStatus(req.params.id, isActive);
    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, url, `URL ${isActive ? 'enabled' : 'disabled'} successfully`)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle favorite status.
 */
export const toggleFavorite = async (req, res, next) => {
  try {
    const url = await urlService.toggleFavorite(req.params.id);
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
    const result = await urlService.bulkDelete(ids);
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
