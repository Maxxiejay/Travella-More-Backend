/**
 * User model - In-memory storage for MVP
 * This would typically be replaced with a database in a production environment
 */

// In-memory store for users
const users = [];
let nextId = 1;

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Object} Created user
 */
exports.create = (userData) => {
  const newUser = {
    id: nextId++,
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  users.push(newUser);
  return newUser;
};

/**
 * Find user by ID
 * @param {number} id - User ID
 * @returns {Object|null} User if found, null otherwise
 */
exports.findById = (id) => {
  return users.find(user => user.id === id) || null;
};

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Object|null} User if found, null otherwise
 */
exports.findByEmail = (email) => {
  return users.find(user => user.email === email) || null;
};

/**
 * Find user by username
 * @param {string} username - Username
 * @returns {Object|null} User if found, null otherwise
 */
exports.findByUsername = (username) => {
  return users.find(user => user.username === username) || null;
};

/**
 * Get all users
 * @returns {Array} Array of users
 */
exports.getAll = () => {
  return [...users];
};

/**
 * Update user by ID
 * @param {number} id - User ID
 * @param {Object} updateData - Data to update
 * @returns {Object|null} Updated user if found, null otherwise
 */
exports.update = (id, updateData) => {
  const index = users.findIndex(user => user.id === id);
  
  if (index === -1) {
    return null;
  }
  
  users[index] = {
    ...users[index],
    ...updateData,
    updatedAt: new Date()
  };
  
  return users[index];
};

/**
 * Delete user by ID
 * @param {number} id - User ID
 * @returns {boolean} True if deleted, false otherwise
 */
exports.delete = (id) => {
  const index = users.findIndex(user => user.id === id);
  
  if (index === -1) {
    return false;
  }
  
  users.splice(index, 1);
  return true;
};
