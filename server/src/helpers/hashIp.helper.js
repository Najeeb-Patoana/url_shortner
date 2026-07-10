import crypto from 'crypto';

/**
 * Anonymize an IP address by creating a one-way SHA-256 hash.
 * Includes a salt to prevent rainbow table attacks.
 * @param {string} ip - Raw IP address
 * @returns {string} Hex-encoded SHA-256 hash of the IP
 */
const hashIp = (ip) => {
  if (!ip) return 'unknown';

  const salt = process.env.IP_HASH_SALT || 'url-shortener-default-salt';
  return crypto
    .createHmac('sha256', salt)
    .update(ip)
    .digest('hex');
};

export default hashIp;
