import UAParser from 'ua-parser-js';

/**
 * Parse the User-Agent string to extract browser, OS, and device information.
 * @param {string} userAgent - Raw User-Agent header string
 * @returns {{ browser: string, os: string, device: string, platform: string }}
 */
const parseUserAgent = (userAgent) => {
  if (!userAgent) {
    return { browser: 'Unknown', os: 'Unknown', device: 'Desktop', platform: 'Unknown' };
  }

  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  const browser = result.browser.name || 'Unknown';
  const os = result.os.name || 'Unknown';

  // Determine device type
  let device = 'Desktop';
  if (result.device.type === 'mobile') device = 'Mobile';
  else if (result.device.type === 'tablet') device = 'Tablet';
  else if (result.device.type === 'wearable') device = 'Wearable';

  const platform = result.device.vendor
    ? `${result.device.vendor} ${result.device.model || ''}`.trim()
    : os;

  return { browser, os, device, platform };
};

export default parseUserAgent;
