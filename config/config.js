/**
 * Application configuration
 * Loads from environment variables with reasonable defaults
 */
module.exports = {
  // Application information
  appName: process.env.APP_NAME || 'Auth API',
  appUrl: process.env.APP_URL || 'http://localhost:8000',
  
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
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // Email configuration
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || 'noreply@example.com'
  },
  
  // Password reset token expiry (in minutes)
  passwordResetExpiry: process.env.PASSWORD_RESET_EXPIRY || 60,
  
  // Email verification token expiry (in hours)
  emailVerificationExpiry: process.env.EMAIL_VERIFICATION_EXPIRY || 24
};
