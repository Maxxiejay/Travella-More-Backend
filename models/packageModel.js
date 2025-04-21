/**
 * Package Model
 * Handles CRUD operations for package data
 */

let packages = [];
let packageIdCounter = 1;

/**
 * Create a new package
 * @param {Object} packageData - Package data
 * @returns {Object} Created package
 */
const createPackage = (packageData) => {
  const newPackage = {
    id: packageIdCounter++,
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
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: packageData.userId || null, // Reference to user if authenticated
    status: packageData.status || 'pending'
  };
  
  packages.push(newPackage);
  return newPackage;
};

/**
 * Find a package by ID
 * @param {number} id - Package ID
 * @returns {Object|null} Package object or null if not found
 */
const findById = (id) => {
  return packages.find(pkg => pkg.id === parseInt(id)) || null;
};

/**
 * Find packages by user ID
 * @param {number} userId - User ID
 * @returns {Array} Array of packages
 */
const findByUserId = (userId) => {
  return packages.filter(pkg => pkg.userId === userId);
};

/**
 * Get all packages
 * @returns {Array} Array of all packages
 */
const getAllPackages = () => {
  return [...packages];
};

/**
 * Update a package
 * @param {number} id - Package ID
 * @param {Object} updateData - Updated package data
 * @returns {Object|null} Updated package or null if not found
 */
const updatePackage = (id, updateData) => {
  const packageIndex = packages.findIndex(pkg => pkg.id === parseInt(id));
  if (packageIndex === -1) return null;
  
  // Create updated package object
  const updatedPackage = {
    ...packages[packageIndex],
    ...updateData,
    updatedAt: new Date()
  };
  
  // Replace old package with updated one
  packages[packageIndex] = updatedPackage;
  return updatedPackage;
};

/**
 * Delete a package
 * @param {number} id - Package ID
 * @returns {boolean} True if deleted, false otherwise
 */
const deletePackage = (id) => {
  const initialLength = packages.length;
  packages = packages.filter(pkg => pkg.id !== parseInt(id));
  return packages.length < initialLength;
};

module.exports = {
  createPackage,
  findById,
  findByUserId,
  getAllPackages,
  updatePackage,
  deletePackage
};