/**
 * Application configuration
 */
module.exports = {
  // Server configuration
  port: process.env.PORT || 8000,
  host: process.env.HOST || '0.0.0.0',
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  }
};
