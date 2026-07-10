import Url from '../models/Url.model.js';
import logger from '../config/logger.js';

/**
 * Background job to disable expired URLs.
 * Runs every hour. MongoDB TTL index will delete after 24h of expiry,
 * but we disable them immediately for user experience.
 */
const cleanupExpiredUrls = async () => {
  try {
    const result = await Url.updateMany(
      {
        expiresAt: { $lt: new Date(), $ne: null },
        isActive: true,
      },
      { isActive: false }
    );

    if (result.modifiedCount > 0) {
      logger.info(`Expired URLs cleanup: disabled ${result.modifiedCount} URLs`);
    }
  } catch (error) {
    logger.error(`Expired URLs cleanup job failed: ${error.message}`);
  }
};

/**
 * Start the expired URLs cleanup job.
 * Runs immediately on startup, then every hour.
 */
export const startExpiredUrlsJob = () => {
  const INTERVAL_MS = 60 * 60 * 1000; // 1 hour
  cleanupExpiredUrls(); // Run immediately
  setInterval(cleanupExpiredUrls, INTERVAL_MS);
  logger.info('Expired URLs cleanup job started (runs every 1 hour)');
};
