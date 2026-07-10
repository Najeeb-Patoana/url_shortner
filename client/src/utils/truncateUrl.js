/**
 * Truncate a URL to a readable length.
 * @param {string} url
 * @param {number} maxLength
 */
export const truncateUrl = (url, maxLength = 50) => {
  if (!url) return '';
  // Remove protocol for display
  const clean = url.replace(/^https?:\/\//, '');
  if (clean.length <= maxLength) return clean;
  return `${clean.substring(0, maxLength)}...`;
};

/**
 * Extract domain from a URL.
 */
export const extractDomain = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};
