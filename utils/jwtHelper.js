const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Generate JWT token
 * @param {Object} payload - The data to encode in the token
 * @returns {string} JWT token
 */
exports.generateToken = (payload) => {
  return jwt.sign(
    payload,
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
};

/**
 * Verify JWT token
 * @param {string} token - The JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid
 */
exports.verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};
