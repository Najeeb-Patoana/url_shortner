import analyticsRepository from '../repositories/analytics.repository.js';
import parseUserAgent from '../helpers/uaParser.helper.js';
import getGeoInfo from '../helpers/geo.helper.js';
import hashIp from '../helpers/hashIp.helper.js';
import logger from '../config/logger.js';

const analyticsService = {
  /**
   * Record a click event asynchronously.
   * Parses UA, geo, and hashes the IP before storing.
   * @param {object} urlId - Mongo ObjectId of the URL
   * @param {object} req - Express request object
   */
  recordClick: async (urlId, req) => {
    try {
      const userAgent = req.headers['user-agent'] || '';
      const referrer = req.headers['referer'] || req.headers['referrer'] || 'Direct';
      const language = req.headers['accept-language']?.split(',')[0] || 'Unknown';
      const ip = req.ip || req.connection?.remoteAddress || '';

      // Run UA parsing and geo lookup in parallel
      const [{ browser, os, device, platform }, { country, city, timezone }] = await Promise.all([
        Promise.resolve(parseUserAgent(userAgent)),
        getGeoInfo(ip),
      ]);

      const ipHash = hashIp(ip);

      await analyticsRepository.create({
        urlId,
        browser,
        os,
        device,
        platform,
        country,
        city,
        referrer: referrer.length > 500 ? referrer.substring(0, 500) : referrer,
        ipHash,
        language,
        timezone,
        userAgent: userAgent.substring(0, 500),
        clickedAt: new Date(),
      });
    } catch (error) {
      // Analytics failure should NEVER break the redirect
      logger.error(`Analytics recording failed: ${error.message}`);
    }
  },

  /**
   * Get full analytics for a URL.
   */
  getUrlAnalytics: async (urlId) => {
    const [dailyClicks, topBrowsers, topCountries, topDevices, topReferrers, totalClicks] =
      await Promise.all([
        analyticsRepository.getDailyClicks(urlId, 30),
        analyticsRepository.getTopBrowsers(urlId, 10),
        analyticsRepository.getTopCountries(urlId, 10),
        analyticsRepository.getTopDevices(urlId, 5),
        analyticsRepository.getTopReferrers(urlId, 10),
        analyticsRepository.countByUrl(urlId),
      ]);

    return {
      totalClicks,
      dailyClicks,
      topBrowsers,
      topCountries,
      topDevices,
      topReferrers,
    };
  },

  /**
   * Get global analytics for the admin dashboard.
   */
  getDashboardAnalytics: async () => {
    const [globalDailyClicks, totalClicks] = await Promise.all([
      analyticsRepository.getGlobalDailyClicks(30),
      analyticsRepository.getTotalClicks(),
    ]);
    return { globalDailyClicks, totalClicks };
  },

  /**
   * Export all analytics data for a URL as raw records.
   */
  exportAnalytics: async (urlId) => {
    return analyticsRepository.exportByUrl(urlId);
  },
};

export default analyticsService;
