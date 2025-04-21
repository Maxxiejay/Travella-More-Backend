/**
 * Email Service
 * Handles all email sending functionality for the application
 */
const nodemailer = require('nodemailer');
const config = require('../config/config');

/**
 * Create email transporter
 * @returns {Object} Nodemailer transporter
 */
const createTransporter = () => {
  // Check if we have email configuration
  if (config.email.host && config.email.user && config.email.password) {
    // Use the provided email configuration
    console.log(`Creating email transporter with host: ${config.email.host}, port: ${config.email.port}, secure: ${config.email.secure}`);
    
    return nodemailer.createTransport({
      host: config.email.host,
      port: parseInt(config.email.port, 10) || 587,
      secure: config.email.secure === 'true',
      auth: {
        user: config.email.user,
        pass: config.email.password
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false
      }
    });
  } else {
    console.warn('Email configuration is incomplete. Using Ethereal for testing.');
    // For development, use Ethereal (fake SMTP service for testing)
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal_pass'
      }
    });
  }
};

/**
 * Send welcome email after registration
 * @param {Object} user - User data
 * @returns {Promise} - Email sending result
 */
const sendWelcomeEmail = async (user) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${config.appName}" <${config.email.from}>`,
      to: user.email,
      subject: `Welcome to ${config.appName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to ${config.appName}!</h2>
          <p>Hello ${user.fullName},</p>
          <p>Thank you for registering with us. Your account has been created successfully.</p>
          <p>Here are your account details:</p>
          <ul>
            <li>Username: ${user.username}</li>
            <li>Email: ${user.email}</li>
            <li>Business Name: ${user.businessName}</li>
          </ul>
          <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
          <p>Best regards,<br>The ${config.appName} Team</p>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent: ${info.messageId}`);
    
    // For development environment with Ethereal, log preview URL
    if (config.nodeEnv !== 'production') {
      console.log(`Email preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    return info;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

/**
 * Send password reset email
 * @param {Object} user - User data
 * @param {String} resetToken - Password reset token
 * @param {String} resetUrl - Password reset URL
 * @returns {Promise} - Email sending result
 */
const sendPasswordResetEmail = async (user, resetToken, resetUrl) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${config.appName}" <${config.email.from}>`,
      to: user.email,
      subject: `Password Reset Request`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hello ${user.fullName},</p>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
          </div>
          <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
          <p>This link will expire in 1 hour for security reasons.</p>
          <p>Best regards,<br>The ${config.appName} Team</p>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent: ${info.messageId}`);
    
    if (config.nodeEnv !== 'production') {
      console.log(`Email preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    return info;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

/**
 * Send email verification email
 * @param {Object} user - User data
 * @param {String} verificationToken - Email verification token
 * @param {String} verificationUrl - Email verification URL
 * @returns {Promise} - Email sending result
 */
const sendVerificationEmail = async (user, verificationToken, verificationUrl) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${config.appName}" <${config.email.from}>`,
      to: user.email,
      subject: `Verify Your Email Address`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Hello ${user.fullName},</p>
          <p>Please verify your email address by clicking the button below:</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
          </div>
          <p>If you didn't create an account with us, please ignore this email.</p>
          <p>Best regards,<br>The ${config.appName} Team</p>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Verification email sent: ${info.messageId}`);
    
    if (config.nodeEnv !== 'production') {
      console.log(`Email preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    return info;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

/**
 * Send a test email to verify email configuration
 * @param {String} toEmail - Recipient email address
 * @returns {Promise} - Email sending result
 */
const sendTestEmail = async (toEmail) => {
  try {
    const transporter = createTransporter();
    
    // Log email config for debugging
    console.log('Email configuration:', {
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      user: config.email.user ? '****' : undefined, // Hide actual credentials
      from: config.email.from
    });
    
    const mailOptions = {
      from: `"${config.appName}" <${config.email.from}>`,
      to: toEmail,
      subject: `Test Email - ${config.appName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Test Email</h2>
          <p>This is a test email to verify your email service configuration.</p>
          <p>If you received this, your email configuration is working correctly!</p>
          <p>Time sent: ${new Date().toISOString()}</p>
          <hr />
          <p>Best regards,<br>The ${config.appName} Team</p>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Test email sent: ${info.messageId}`);
    
    if (config.nodeEnv !== 'production') {
      console.log(`Email preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    return info;
  } catch (error) {
    console.error('Error sending test email:', error);
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendTestEmail,
  createTransporter
};