import urlRepository from '../repositories/url.repository.js';
import generateShortCode from '../utils/generateShortCode.js';
import generateQR from '../utils/generateQR.js';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import logger from '../config/logger.js';

const urlService = {
  /**
   * Create a new shortened URL (no owner required).
   */
  create: async ({ originalUrl, customAlias, expiresAt, title, tags }) => {
    let shortCode;

    if (customAlias) {
      const exists = await urlRepository.existsByCode(customAlias);
      if (exists) {
        throw new ApiError(HTTP_STATUS.CONFLICT, `Alias "${customAlias}" is already taken`);
      }
      shortCode = customAlias;
    } else {
      let attempts = 0;
      do {
        shortCode = generateShortCode();
        attempts++;
        if (attempts > 10) {
          throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Could not generate a unique short code');
        }
      } while (await urlRepository.existsByCode(shortCode));
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const fullShortUrl = `${baseUrl}/${customAlias || shortCode}`;
    const qrCode = await generateQR(fullShortUrl);

    const url = await urlRepository.create({
      originalUrl,
      shortCode,
      customAlias: customAlias || undefined,
      owner: null, // No owner — public URL
      expiresAt: expiresAt || null,
      qrCode,
      title: title || '',
      tags: tags || [],
    });

    logger.info(`URL created: ${shortCode} → ${originalUrl}`);
    return url;
  },

  /**
   * Get all URLs (no owner filter) with pagination, search, sort.
   */
  getAllUrls: async ({ page = 1, limit = 10, search = '', sort = '-createdAt', filter = {} } = {}) => {
    const [urls, total] = await Promise.all([
      urlRepository.findAll({ page, limit, search, sort, filter }),
      urlRepository.count(filter),
    ]);
    return { urls, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  /**
   * Get a single URL by ID.
   */
  getUrlById: async (id) => {
    const url = await urlRepository.findById(id);
    if (!url) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'URL not found');
    }
    return url;
  },

  /**
   * Update a URL's metadata.
   */
  update: async (id, updates) => {
    if (updates.customAlias) {
      const exists = await urlRepository.existsByCode(updates.customAlias);
      if (exists) {
        throw new ApiError(HTTP_STATUS.CONFLICT, `Alias "${updates.customAlias}" is already taken`);
      }
    }
    const url = await urlRepository.updateById(id, updates);
    if (!url) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'URL not found');
    }
    return url;
  },

  /**
   * Delete a URL.
   */
  delete: async (id) => {
    const url = await urlRepository.deleteById(id);
    if (!url) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'URL not found');
    }
    logger.info(`URL deleted: ${id}`);
    return url;
  },

  /**
   * Toggle active/inactive status.
   */
  toggleStatus: async (id, isActive) => {
    const url = await urlRepository.updateById(id, { isActive });
    if (!url) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'URL not found');
    }
    return url;
  },

  /**
   * Toggle favorite flag.
   */
  toggleFavorite: async (id) => {
    const url = await urlRepository.findById(id);
    if (!url) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'URL not found');
    }
    return urlRepository.updateById(id, { isFavorite: !url.isFavorite });
  },

  /**
   * Bulk delete URLs.
   */
  bulkDelete: async (ids) => {
    return urlRepository.bulkDelete(ids);
  },

  /**
   * Bulk update status.
   */
  bulkUpdateStatus: async (ids, isActive) => {
    return urlRepository.bulkUpdateStatus(ids, isActive);
  },

  /**
   * Find URL by short code for redirect.
   */
  findByCode: async (code) => {
    return urlRepository.findByCode(code);
  },

  /**
   * Increment click count.
   */
  incrementClicks: async (id) => {
    return urlRepository.incrementClicks(id);
  },
};

export default urlService;
