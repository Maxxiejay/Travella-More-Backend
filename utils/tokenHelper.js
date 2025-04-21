/**
 * Token Helper
 * Utility functions for generating and validating tokens
 */
const crypto = require('crypto');

/**
 * Generate a random token
 * @returns {string} Random token
 */
exports.generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Hash a token
 * @param {string} token - Token to hash
 * @returns {string} Hashed token
 */
exports.hashToken = (token) => {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
};

/**
 * Generate expiry date
 * @param {number} hours - Number of hours to add to current date
 * @returns {Date} Expiry date
 */
exports.generateExpiryDate = (hours) => {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
};

/**
 * Check if a date is expired
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is in the past, false otherwise
 */
exports.isExpired = (date) => {
  return date < new Date();
};