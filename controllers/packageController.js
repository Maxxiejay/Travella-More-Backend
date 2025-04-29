/**
 * Package Controller
 * Handles API requests for package CRUD operations
 */
const packageModel = require('../models/packageModel');

/**
 * Create Package Controller
 * Creates a new package with the provided details
 */
exports.createPackage = async (req, res, next) => {
  try {
    const packageData = req.body;
    
    // Add user ID from authenticated user if available
    if (req.user) {
      packageData.userId = req.user.id;
    }
    
    // Create the new package
    const newPackage = await packageModel.createPackage(packageData);
    
    // Format and update the packageCode (e.g., PKG-001)
    const formattedCode = `PKG-${String(newPackage.id).padStart(3, '0')}`;
    await newPackage.update({ packageCode: formattedCode });
    
    // Return success response
    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      package: newPackage
    });
  } catch (err) {
    console.error('Create package error:', err);
    next(err);
  }
};
/**
 * Get Package Controller
 * Returns a specific package by ID
 */
exports.getPackage = (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Find package by ID
    const packageData = packageModel.findById(id);
    
    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }
    
    // Check authorization if not admin (user can only view their own packages)
    if (req.user && req.user.role !== 'admin' && packageData.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this package'
      });
    }
    
    // Return package data
    res.status(200).json({
      success: true,
      package: packageData
    });
  } catch (err) {
    console.error('Get package error:', err);
    next(err);
  }
};

/**
 * Get User Packages Controller
 * Returns all packages for the authenticated user
 */
exports.getUserPackages = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Await the async function
    const packages = await packageModel.findByUserId(userId);

    res.status(200).json({
      success: true,
      count: packages.length,
      packages
    });
  } catch (err) {
    console.error('Get user packages error:', err);
    next(err);
  }
};

/**
 * Get All Packages Controller (Admin only)
 * Returns all packages in the system
 */
exports.getAllPackages = (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access all packages'
      });
    }
    
    // Get all packages
    const packages = packageModel.getAllPackages();
    
    // Return packages data
    res.status(200).json({
      success: true,
      count: packages.length,
      packages
    });
  } catch (err) {
    console.error('Get all packages error:', err);
    next(err);
  }
};

/**
 * Update Package Controller
 * Updates an existing package
 */
exports.updatePackage = (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Find package by ID
    const existingPackage = packageModel.findById(id);
    
    if (!existingPackage) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }
    
    // Check authorization if not admin (user can only update their own packages)
    if (req.user && req.user.role !== 'admin' && existingPackage.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this package'
      });
    }
    
    // Update the package
    const updatedPackage = packageModel.updatePackage(id, updateData);
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Package updated successfully',
      package: updatedPackage
    });
  } catch (err) {
    console.error('Update package error:', err);
    next(err);
  }
};

/**
 * Delete Package Controller
 * Deletes an existing package
 */
exports.deletePackage = (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Find package by ID
    const existingPackage = packageModel.findById(id);
    
    if (!existingPackage) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }
    
    // Check authorization if not admin (user can only delete their own packages)
    if (req.user && req.user.role !== 'admin' && existingPackage.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this package'
      });
    }
    
    // Delete the package
    const isDeleted = packageModel.deletePackage(id);
    
    if (!isDeleted) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete package'
      });
    }
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (err) {
    console.error('Delete package error:', err);
    next(err);
  }
};