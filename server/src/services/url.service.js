import urlRepository from '../repositories/url.repository.js';
import generateShortCode from '../utils/generateShortCode.js';
import generateQR from '../utils/generateQR.js';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import logger from '../config/logger.js';

const urlService = {
  /**
   * Create a new shortened URL.
   */
  create: async ({ originalUrl, customAlias, expiresAt, title, tags }, ownerId) => {
    let shortCode;

    if (customAlias) {
      // Validate alias uniqueness
      const exists = await urlRepository.existsByCode(customAlias);
      if (exists) {
        throw new ApiError(HTTP_STATUS.CONFLICT, `Alias "${customAlias}" is already taken`);
      }
      shortCode = customAlias;
    } else {
      // Generate unique random short code
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

    // Generate QR code
    const qrCode = await generateQR(fullShortUrl);

    const url = await urlRepository.create({
      originalUrl,
      shortCode,
      customAlias: customAlias || undefined,
      owner: ownerId,
      expiresAt: expiresAt || null,
      qrCode,
      title: title || '',
      tags: tags || [],
    });

    logger.info(`URL created: ${shortCode} → ${originalUrl}`);
    return url;
  },

  /**
   * Get all URLs for a user with pagination, search, sort, and filter.
   */
  getUserUrls: async (ownerId, { page, limit, search, sort, filter } = {}) => {
    const [urls, total] = await Promise.all([
      urlRepository.findByOwner({ ownerId, page, limit, search, sort, filter }),
      urlRepository.countByOwner(ownerId, filter),
    ]);
    return { urls, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  /**
   * Get a single URL by ID (owner scoped).
   */
  getUrlById: async (id, ownerId, isAdmin = false) => {
    const url = isAdmin
      ? await urlRepository.findById(id)
      : await urlRepository.findByIdAndOwner(id, ownerId);
    if (!url) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'URL not found');
    }
    return url;
  },

  /**
   * Update a URL's metadata.
   */
  update: async (id, ownerId, updates, isAdmin = false) => {
    // If changing alias, check uniqueness
    if (updates.customAlias) {
      const exists = await urlRepository.existsByCode(updates.customAlias);
      if (exists) {
        throw new ApiError(HTTP_STATUS.CONFLICT, `Alias "${updates.customAlias}" is already taken`);
      }
    }

    const url = isAdmin
      ? await urlRepository.updateById(id, updates)
      : await urlRepository.updateByIdAndOwner(id, ownerId, updates);

    if (!url) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'URL not found or not authorized');
    }
    return url;
  },

  /**
   * Delete a URL.
   */
  delete: async (id, ownerId, isAdmin = false) => {
    const url = isAdmin
      ? await urlRepository.deleteById(id)
      : await urlRepository.deleteByIdAndOwner(id, ownerId);
    if (!url) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'URL not found or not authorized');
    }
    logger.info(`URL deleted: ${id}`);
    return url;
  },

  /**
   * Toggle active/inactive status.
   */
  toggleStatus: async (id, ownerId, isActive, isAdmin = false) => {
    const url = isAdmin
      ? await urlRepository.updateById(id, { isActive })
      : await urlRepository.updateByIdAndOwner(id, ownerId, { isActive });
    if (!url) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'URL not found or not authorized');
    }
    return url;
  },

  /**
   * Toggle favorite flag.
   */
  toggleFavorite: async (id, ownerId) => {
    const url = await urlRepository.findByIdAndOwner(id, ownerId);
    if (!url) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'URL not found');
    }
    return urlRepository.updateByIdAndOwner(id, ownerId, { isFavorite: !url.isFavorite });
  },

  /**
   * Bulk delete URLs.
   */
  bulkDelete: async (ids, ownerId, isAdmin = false) => {
    if (isAdmin) {
      return urlRepository.bulkDelete(ids);
    }
    // For regular users, only delete own URLs
    const { deletedCount } = await urlRepository.bulkDelete(ids);
    return { deletedCount };
  },

  /**
   * Bulk update status.
   */
  bulkUpdateStatus: async (ids, isActive) => {
    return urlRepository.bulkUpdateStatus(ids, isActive);
  },

  /**
   * Admin: get all URLs.
   */
  getAllUrls: async ({ page, limit, search, sort, filter } = {}) => {
    const [urls, total] = await Promise.all([
      urlRepository.findAll({ page, limit, search, sort, filter }),
      urlRepository.count(filter),
    ]);
    return { urls, total, page, limit, totalPages: Math.ceil(total / limit) };
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
