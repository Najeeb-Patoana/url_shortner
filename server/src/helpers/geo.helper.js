import axios from 'axios';
import logger from '../config/logger.js';

/**
 * Look up geographic information for an IP address using ip-api.com.
 * For production, replace with MaxMind GeoIP2 or IPStack for better accuracy.
 * @param {string} ip - IP address to look up
 * @returns {Promise<{ country: string, city: string, timezone: string }>}
 */
const getGeoInfo = async (ip) => {
  // Skip lookup for localhost/private IPs
  const localIps = ['::1', '127.0.0.1', 'localhost'];
  if (!ip || localIps.includes(ip)) {
    return { country: 'Local', city: 'Local', timezone: 'Local' };
  }

  try {
    const response = await axios.get(
      `http://ip-api.com/json/${ip}?fields=status,country,city,timezone`,
      { timeout: 3000 }
    );

    if (response.data.status === 'success') {
      return {
        country: response.data.country || 'Unknown',
        city: response.data.city || 'Unknown',
        timezone: response.data.timezone || 'Unknown',
      };
    }

    return { country: 'Unknown', city: 'Unknown', timezone: 'Unknown' };
  } catch (error) {
    logger.warn(`Geo lookup failed for IP ${ip}: ${error.message}`);
    return { country: 'Unknown', city: 'Unknown', timezone: 'Unknown' };
  }
};

export default getGeoInfo;
