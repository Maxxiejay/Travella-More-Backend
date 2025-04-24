const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const jwtHelper = require('../utils/jwtHelper');
const emailService = require('../utils/emailService');
const tokenHelper = require('../utils/tokenHelper');
const config = require('../config/config');

/**
 * User Registration Controller
 * Registers a new user in the system
 */
exports.signup = async (req, res, next) => {
  try {
    const { username, email, password, fullName, mobile, businessName, businessLocation } = req.body;

    // Check if user already exists with the provided email
    const existingUserByEmail = await userModel.findByEmail(email);
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Check if username is already taken
    const existingUserByUsername = await userModel.findByUsername(username);
    if (existingUserByUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken'
      });
    }
    // Generate salt and hash the password  
const salt = await bcrypt.genSalt(10);  
const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user object
    const newUser = {
      username,
      email,
      password: hashedPassword ,
      fullName,
      mobile,
      businessName,
      businessLocation,
      createdAt: new Date()
    };

    // Save the user
    const user = await userModel.createUser(newUser);
    
    // Generate email verification token
    const verificationToken = tokenHelper.generateRandomToken();
    const tokenHash = tokenHelper.hashToken(verificationToken);
    const expiryDate = tokenHelper.generateExpiryDate(config.emailVerificationExpiry);
    
    // Update user with verification token
    await userModel.setEmailVerificationToken(user.id, tokenHash, expiryDate);
    
    // Create verification URL
    const verificationUrl = `${config.appUrl}/api/auth/verify-email/${tokenHash}`;
    
    // Send verification email - don't wait for it to complete
    emailService.sendVerificationEmail(user, tokenHash, verificationUrl)
      .catch(err => console.error('Error sending verification email:', err));
    
    // Generate JWT token for authentication
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    };

    const token = jwtHelper.generateToken(payload);

    // Return success response with token
    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        isVerified: false
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    next(err);
  }
};

/**
 * User Login Controller
 * Authenticates user and returns a JWT token
 */
exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await userModel.findByEmail(email);
    
    if (!user) {
      console.error(`Signin error: User with email ${email} not found`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials email'
      });
    }

console.log("on signin:", user.password) 
    // Compare password
     const isMatch = await bcrypt.compare(password, user.password);
     if (!isMatch) {
       console.error(`Signin error: Password mismatch for user with email ${email}`);
      return res.status(401).json({
         success: false,
         message: 'Invalid credentials pass'
       });
     }

    // Generate JWT toke  n
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    };

    const token = jwtHelper.generateToken(payload);

    // Return success response with token
    const userData = user.toJSON();
delete userData.password;

res.status(201).json({
  success: true,
  message: 'User registered successfully. Please check your email to verify your account.',
  token,
  user: {
    id: userData.id,
    username: userData.username,
    email: userData.email,
    fullName: userData.fullName,
    isVerified: userData.isVerified
  }
});
  } catch (err) {
    console.error('Signin error:', err.message);
    next(err);
  }
};

/**
 * Get User Profile Controller
 * Returns user profile data for authenticated users
 */
exports.getProfile = async (req, res, next) => {
  try {
    // Get authenticated user ID from request (set by auth middleware)
    const userId = req.user.id;
    
    // Find user in the database
    const user = await userModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Return user data (excluding sensitive information)
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        mobile: user.mobile,
        businessName: user.businessName,
        businessLocation: user.businessLocation,
        createdAt: user.createdAt,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    console.error('Get profile error:', err);
    next(err);
  }
};

/**
 * Verify Email Controller
 * Verifies a user's email using the token sent to their email
 */
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification link'
      });
    }

    // Find user by the verification token
    const user = await userModel.findByEmailVerificationToken(token);
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification link'
      });
    }
    
    // Check if token is expired
    if (tokenHelper.isExpired(user.verificationExpires)) {
      return res.status(400).json({
        success: false,
        message: 'Verification link has expired'
      });
    }
    
    // Mark user's email as verified
    await userModel.verifyEmail(user.id);
    
    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (err) {
    console.error('Email verification error:', err);
    next(err);
  }
};

/**
 * Resend Verification Email Controller
 * Sends a new verification email to the user
 */
exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await userModel.findByEmail(email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if email is already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }
    
    // Generate verification token
    const verificationToken = tokenHelper.generateRandomToken();
    const tokenHash = tokenHelper.hashToken(verificationToken);
    const expiryDate = tokenHelper.generateExpiryDate(config.emailVerificationExpiry);
    
    // Update user with new verification token
    await userModel.setEmailVerificationToken(user.id, tokenHash, expiryDate);
    
    // Create verification URL
    const verificationUrl = `${config.appUrl}/api/auth/verify-email/${tokenHash}`;
    
    // Send verification email
    await emailService.sendVerificationEmail(user, tokenHash, verificationUrl);
    
    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully'
    });
  } catch (err) {
    console.error('Resend verification error:', err);
    next(err);
  }
};

/**
 * Forgot Password Controller
 * Handles password reset requests and sends reset emails
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await userModel.findByEmail(email);
    
    // Even if user is not found, return success for security reasons
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If your email is registered, you will receive a password reset link shortly'
      });
    }
    
    // Generate reset token
    const resetToken = tokenHelper.generateRandomToken();
    const tokenHash = tokenHelper.hashToken(resetToken);
    const expiryDate = new Date(Date.now() + config.passwordResetExpiry * 60 * 1000); // Convert minutes to milliseconds
    
    // Update user with reset token
    await userModel.setPasswordResetToken(user.id, tokenHash, expiryDate);
    
    // Create reset URL
    const resetUrl = `${config.appUrl}/api/auth/reset-password/${tokenHash}`;
    
    // Send password reset email
    await emailService.sendPasswordResetEmail(user, tokenHash, resetUrl);
    
    res.status(200).json({
      success: true,
      message: 'If your email is registered, you will receive a password reset link shortly'
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    next(err);
  }
};

/**
 * Validate Reset Token Controller
 * Checks if a password reset token is valid
 */
exports.validateResetToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset token'
      });
    }
    
    // Find user by reset token
    const user = await userModel.findByPasswordResetToken(token);
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset token'
      });
    }
    
    // Check if token is expired
    if (tokenHelper.isExpired(user.resetPasswordExpires)) {
      return res.status(400).json({
        success: false,
        message: 'Reset token has expired'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Valid reset token',
      email: user.email
    });
  } catch (err) {
    console.error('Validate reset token error:', err);
    next(err);
  }
};

/**
 * Reset Password Controller
 * Resets user password with valid token
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset token'
      });
    }
    
    // Find user by reset token
    const user = await userModel.findByPasswordResetToken(token);
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset token'
      });
    }
    
    // Check if token is expired
    if (tokenHelper.isExpired(user.resetPasswordExpires)) {
      return res.status(400).json({
        success: false,
        message: 'Reset token has expired'
      });
    }
    
    // Generate salt and hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Update user with new password and clear reset token
    await userModel.updateUser(user.id, { password: hashedPassword });
    await userModel.clearPasswordResetToken(user.id);
    
    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    next(err);
  }
};

/**
 * Test Email Service Controller
 * Sends a test email to verify email configuration
 */
exports.testEmailService = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }
    
    // Log the email configuration (without sensitive data)
    console.log('Testing email service with:', {
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure === true ? 'true' : 'false',
      from: config.email.from,
      to: email
    });
    
    // Send test email
    await emailService.sendTestEmail(email);
    
    res.status(200).json({
      success: true,
      message: 'Test email sent successfully. Please check your inbox.'
    });
  } catch (err) {
    console.error('Test email error:', err);
    
    // Return detailed error for troubleshooting
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: {
        message: err.message,
        code: err.code,
        responseCode: err.responseCode,
        response: err.response
      }
    });
  }
};
