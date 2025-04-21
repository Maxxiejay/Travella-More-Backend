/**
 * Package Model
 * Handles CRUD operations for package data using Sequelize
 */

const { Package } = require('./index');

/**
 * Create a new package
 * @param {Object} packageData - Package data
 * @returns {Object} Created package
 */
const createPackage = async (packageData) => {
  try {
    const newPackage = await Package.create({
      // Pickup Information
      pickupAddress: packageData.pickupAddress || '',
      pickupContactNumber: packageData.pickupContactNumber || '',
      pickupCountry: packageData.pickupCountry || '',
      pickupState: packageData.pickupState || '',
      pickupCity: packageData.pickupCity || '',
      
      // Delivery Information
      deliveryAddress: packageData.deliveryAddress || '',
      deliveryContactNumber: packageData.deliveryContactNumber || '',
      deliveryCountry: packageData.deliveryCountry || '',
      deliveryState: packageData.deliveryState || '',
      deliveryCity: packageData.deliveryCity || '',
      
      // Package Details
      packageDescription: packageData.packageDescription || '',
      weightKg: packageData.weightKg || 0,
      
      // Pricing Information
      hasPackageDiscount: packageData.hasPackageDiscount || false,
      
      // Meta data
      userId: packageData.userId || null,
      status: packageData.status || 'pending'
    });
    
    return newPackage.toJSON();
  } catch (error) {
    console.error('Error creating package:', error);
    return null;
  }
};

/**
 * Find a package by ID
 * @param {number} id - Package ID
 * @returns {Object|null} Package object or null if not found
 */
const findById = async (id) => {
  try {
    const pkg = await Package.findByPk(parseInt(id));
    return pkg ? pkg.toJSON() : null;
  } catch (error) {
    console.error('Error finding package by ID:', error);
    return null;
  }
};

/**
 * Find packages by user ID
 * @param {number} userId - User ID
 * @returns {Array} Array of packages
 */
const findByUserId = async (userId) => {
  try {
    const packages = await Package.findAll({ 
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    return packages.map(pkg => pkg.toJSON());
  } catch (error) {
    console.error('Error finding packages by user ID:', error);
    return [];
  }
};

/**
 * Get all packages
 * @returns {Array} Array of all packages
 */
const getAllPackages = async () => {
  try {
    const packages = await Package.findAll({
      order: [['createdAt', 'DESC']]
    });
    return packages.map(pkg => pkg.toJSON());
  } catch (error) {
    console.error('Error getting all packages:', error);
    return [];
  }
};

/**
 * Update a package
 * @param {number} id - Package ID
 * @param {Object} updateData - Updated package data
 * @returns {Object|null} Updated package or null if not found
 */
const updatePackage = async (id, updateData) => {
  try {
    const pkg = await Package.findByPk(parseInt(id));
    if (!pkg) return null;
    
    await pkg.update(updateData);
    return pkg.toJSON();
  } catch (error) {
    console.error('Error updating package:', error);
    return null;
  }
};

/**
 * Delete a package
 * @param {number} id - Package ID
 * @returns {boolean} True if deleted, false otherwise
 */
const deletePackage = async (id) => {
  try {
    const deleted = await Package.destroy({ 
      where: { id: parseInt(id) } 
    });
    return deleted > 0;
  } catch (error) {
    console.error('Error deleting package:', error);
    return false;
  }
};

module.exports = {
  createPackage,
  findById,
  findByUserId,
  getAllPackages,
  updatePackage,
  deletePackage
};