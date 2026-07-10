import urlService from '../services/url.service.js';
import analyticsService from '../services/analytics.service.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import logger from '../config/logger.js';

/**
 * @swagger
 * /{shortCode}:
 *   get:
 *     summary: Redirect to original URL via short code
 *     tags: [Redirect]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       302:
 *         description: Redirect to original URL
 *       404:
 *         description: URL not found
 *       410:
 *         description: URL has expired or is disabled
 */
export const redirect = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const url = await urlService.findByCode(shortCode);

    if (!url) {
      // Redirect to client-side 404 page
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/not-found`);
    }

    if (!url.isActive) {
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/disabled`);
    }

    if (url.expiresAt && new Date() > new Date(url.expiresAt)) {
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/expired`);
    }

    // Fire analytics in background — do NOT await (keeps redirect fast)
    Promise.all([
      urlService.incrementClicks(url._id),
      analyticsService.recordClick(url._id, req),
    ]).catch((err) => logger.error(`Post-redirect processing failed: ${err.message}`));

    // 302 Temporary redirect (allows analytics re-processing)
    return res.redirect(HTTP_STATUS.OK + 102, url.originalUrl);
  } catch (error) {
    next(error);
  }
};
