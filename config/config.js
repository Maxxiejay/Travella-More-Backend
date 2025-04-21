/**
 * Application configuration
 * Loads from environment variables with reasonable defaults
 */
module.exports = {
  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || 'your-default-jwt-secret-key-should-be-changed-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  
  // Server configuration
  port: process.env.PORT || 8000,
  
  // Environment
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // CORS configuration
  corsOrigin: process.env.CORS_ORIGIN || '*',
  
  // Logging level
  logLevel: process.env.LOG_LEVEL || 'info'
};
