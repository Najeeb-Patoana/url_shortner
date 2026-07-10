import { nanoid } from 'nanoid';

/**
 * Generate a cryptographically secure short code using nanoid.
 * Uses URL-safe alphabet (A-Z, a-z, 0-9) by default.
 * @param {number} length - Length of the short code (default: from env or 6)
 * @returns {string} Generated short code
 */
const generateShortCode = (length = parseInt(process.env.SHORT_CODE_LENGTH) || 6) => {
  // nanoid uses a URL-safe alphabet by default
  return nanoid(length);
};

export default generateShortCode;
