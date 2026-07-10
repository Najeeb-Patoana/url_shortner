import QRCode from 'qrcode';
import logger from '../config/logger.js';

/**
 * Generate a QR code as a Base64 data URL for a given URL string.
 * @param {string} url - The URL to encode in the QR code
 * @returns {Promise<string>} Base64 PNG data URL
 */
const generateQR = async (url) => {
  try {
    const qrDataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'H',
      margin: 2,
      color: {
        dark: '#1a1a2e',
        light: '#ffffff',
      },
      width: 300,
    });
    return qrDataUrl;
  } catch (error) {
    logger.error(`QR code generation failed: ${error.message}`);
    return null;
  }
};

export default generateQR;
