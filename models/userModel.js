/**
 * In-memory User model
 * This is a simple implementation for MVP purposes
 * In a production environment, this would be replaced with a database model
 */

// In-memory storage for users
let users = [];
let nextId = 1; // Simple auto-increment ID

/**
 * Create a new user
 * @param {Object} userData - The user data
 * @returns {Object} The created user object
 */
exports.createUser = (userData) => {
  const now = new Date();
  
  const user = {
    id: nextId++,
    ...userData,
    isEmailVerified: false,
    emailVerificationToken: null,
    emailVerificationExpires: null,
    passwordResetToken: null,
    passwordResetExpires: null,
    createdAt: now,
    updatedAt: now
  };
  
  users.push(user);
  return user;
};

/**
 * Find a user by ID
 * @param {number} id - The user ID
 * @returns {Object|null} The user object or null if not found
 */
exports.findById = (id) => {
  return users.find(user => user.id === id) || null;
};

/**
 * Find a user by email
 * @param {string} email - The user's email
 * @returns {Object|null} The user object or null if not found
 */
exports.findByEmail = (email) => {
  return users.find(user => user.email === email) || null;
};

/**
 * Find a user by username
 * @param {string} username - The username
 * @returns {Object|null} The user object or null if not found
 */
exports.findByUsername = (username) => {
  return users.find(user => user.username === username) || null;
};

/**
 * Update a user
 * @param {number} id - The user ID
 * @param {Object} userData - The updated user data
 * @returns {Object|null} The updated user object or null if not found
 */
exports.updateUser = (id, userData) => {
  const index = users.findIndex(user => user.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const updatedUser = {
    ...users[index],
    ...userData,
    id: users[index].id // Ensure ID doesn't change
  };
  
  users[index] = updatedUser;
  return updatedUser;
};

/**
 * Delete a user
 * @param {number} id - The user ID
 * @returns {boolean} True if user was deleted, false otherwise
 */
exports.deleteUser = (id) => {
  const initialLength = users.length;
  users = users.filter(user => user.id !== id);
  
  return initialLength > users.length;
};

/**
 * Get all users (for administrative purposes)
 * @returns {Array} Array of all users
 */
exports.getAllUsers = () => {
  return [...users]; // Return a copy of the array
};

/**
 * Find a user by email verification token
 * @param {string} token - Email verification token
 * @returns {Object|null} The user object or null if not found
 */
exports.findByEmailVerificationToken = (token) => {
  return users.find(user => user.emailVerificationToken === token) || null;
};

/**
 * Find a user by password reset token
 * @param {string} token - Password reset token
 * @returns {Object|null} The user object or null if not found
 */
exports.findByPasswordResetToken = (token) => {
  return users.find(user => user.passwordResetToken === token) || null;
};

/**
 * Set email verification token for a user
 * @param {number} userId - The user ID
 * @param {string} token - The verification token
 * @param {Date} expiryDate - Token expiry date
 * @returns {Object|null} The updated user or null if not found
 */
exports.setEmailVerificationToken = (userId, token, expiryDate) => {
  return exports.updateUser(userId, {
    emailVerificationToken: token,
    emailVerificationExpires: expiryDate,
    updatedAt: new Date()
  });
};

/**
 * Set password reset token for a user
 * @param {number} userId - The user ID
 * @param {string} token - The reset token
 * @param {Date} expiryDate - Token expiry date
 * @returns {Object|null} The updated user or null if not found
 */
exports.setPasswordResetToken = (userId, token, expiryDate) => {
  return exports.updateUser(userId, {
    passwordResetToken: token,
    passwordResetExpires: expiryDate,
    updatedAt: new Date()
  });
};

/**
 * Mark user email as verified
 * @param {number} userId - The user ID
 * @returns {Object|null} The updated user or null if not found
 */
exports.verifyEmail = (userId) => {
  return exports.updateUser(userId, {
    isEmailVerified: true,
    emailVerificationToken: null,
    emailVerificationExpires: null,
    updatedAt: new Date()
  });
};

/**
 * Clear password reset token after use
 * @param {number} userId - The user ID 
 * @returns {Object|null} The updated user or null if not found
 */
exports.clearPasswordResetToken = (userId) => {
  return exports.updateUser(userId, {
    passwordResetToken: null,
    passwordResetExpires: null,
    updatedAt: new Date()
  });
};
