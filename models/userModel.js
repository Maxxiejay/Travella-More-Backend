/**
 * User Model
 * Handles CRUD operations for user data using Sequelize
 */

const { Sequelize, Op } = require('sequelize');
const { User } = require('./index');
const bcrypt = require('bcrypt');

/**
 * Create a new user
 * @param {Object} userData - The user data
 * @returns {Object} The created user object
 */
exports.createUser = async (userData) => {
  try {
    const user = await User.create({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      fullName: userData.fullName,
      mobile: userData.mobile,
      businessName: userData.businessName,
      businessLocation: userData.businessLocation,
      isVerified: false
    });
    
    return user.get({ plain: true });
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};

/**
 * Find a user by ID
 * @param {number} id - The user ID
 * @returns {Object|null} The user object or null if not found
 */
exports.findById = async (id) => {
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    return user ? user.toJSON() : null;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    return null;
  }
};

/**
 * Find a user by email
 * @param {string} email - The user's email
 * @returns {Object|null} The user object or null if not found
 */
exports.findByEmail = async (email) => {
  try {
    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'username', 'email', 'password', 'fullName', 'isEmailVerified'] // Add whatever you need
    });
    return user;
  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
};
/**
 * Find a user by username
 * @param {string} username - The username
 * @returns {Object|null} The user object or null if not found
 */
exports.findByUsername = async (username) => {
  try {
    const user = await User.findOne({ where: { username } });
    return user;
  } catch (error) {
    console.error('Error finding user by username:', error);
    return null;
  }
};

/**
 * Update a user
 * @param {number} id - The user ID
 * @param {Object} userData - The updated user data
 * @returns {Object|null} The updated user object or null if not found
 */
exports.updateUser = async (id, userData) => {
  try {
    const user = await User.findByPk(id);
    if (!user) return null;
    
    await user.update(userData);
    
    // Return user without password
    const updatedUser = user.toJSON();
    delete updatedUser.password;
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

/**
 * Delete a user
 * @param {number} id - The user ID
 * @returns {boolean} True if user was deleted, false otherwise
 */
exports.deleteUser = async (id) => {
  try {
    const deleted = await User.destroy({ where: { id } });
    return deleted > 0;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
};

/**
 * Get all users (for administrative purposes)
 * @returns {Array} Array of all users
 */
exports.getAllUsers = async () => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    return users.map(user => user.toJSON());
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
};

/**
 * Find a user by email verification token
 * @param {string} token - Email verification token
 * @returns {Object|null} The user object or null if not found
 */
exports.findByEmailVerificationToken = async (token) => {
  try {
    const user = await User.findOne({ 
      where: { 
        verificationToken: token,
        verificationExpires: { [Op.gt]: new Date() }
      } 
    });
    return user;
  } catch (error) {
    console.error('Error finding user by verification token:', error);
    return null;
  }
};

/**
 * Find a user by password reset token
 * @param {string} token - Password reset token
 * @returns {Object|null} The user object or null if not found
 */
exports.findByPasswordResetToken = async (token) => {
  try {
    const user = await User.findOne({ 
      where: { 
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() }
      } 
    });
    return user;
  } catch (error) {
    console.error('Error finding user by reset token:', error);
    return null;
  }
};

/**
 * Set email verification token for a user
 * @param {number} userId - The user ID
 * @param {string} token - The verification token
 * @param {Date} expiryDate - Token expiry date
 * @returns {Object|null} The updated user or null if not found
 */
exports.setEmailVerificationToken = async (userId, token, expiryDate) => {
  try {
    return await exports.updateUser(userId, {
      verificationToken: token,
      verificationExpires: expiryDate
    });
  } catch (error) {
    console.error('Error setting verification token:', error);
    return null;
  }
};

/**
 * Set password reset token for a user
 * @param {number} userId - The user ID
 * @param {string} token - The reset token
 * @param {Date} expiryDate - Token expiry date
 * @returns {Object|null} The updated user or null if not found
 */
exports.setPasswordResetToken = async (userId, token, expiryDate) => {
  try {
    return await exports.updateUser(userId, {
      resetPasswordToken: token,
      resetPasswordExpires: expiryDate
    });
  } catch (error) {
    console.error('Error setting reset token:', error);
    return null;
  }
};

/**
 * Mark user email as verified
 * @param {number} userId - The user ID
 * @returns {Object|null} The updated user or null if not found
 */
exports.verifyEmail = async (userId) => {
  try {
    return await exports.updateUser(userId, {
      isVerified: true,
      verificationToken: null,
      verificationExpires: null
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    return null;
  }
};

/**
 * Clear password reset token after use
 * @param {number} userId - The user ID 
 * @returns {Object|null} The updated user or null if not found
 */
exports.clearPasswordResetToken = async (userId) => {
  try {
    return await exports.updateUser(userId, {
      resetPasswordToken: null,
      resetPasswordExpires: null
    });
  } catch (error) {
    console.error('Error clearing reset token:', error);
    return null;
  }
};