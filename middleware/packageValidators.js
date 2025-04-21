/**
 * Package Validation Middleware
 * Validates input data for package operations
 */
const { body, param, validationResult } = require('express-validator');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Validate package creation data
 */
const validateCreatePackage = [
  // Pickup Information
  body('pickupAddress')
    .trim()
    .notEmpty().withMessage('Pickup address is required'),
    
  body('pickupContactNumber')
    .trim()
    .notEmpty().withMessage('Pickup contact number is required'),
    
  body('pickupCountry')
    .trim()
    .notEmpty().withMessage('Pickup country is required'),
    
  body('pickupState')
    .trim()
    .notEmpty().withMessage('Pickup state is required'),
    
  body('pickupCity')
    .trim()
    .notEmpty().withMessage('Pickup city is required'),
  
  // Delivery Information
  body('deliveryAddress')
    .trim()
    .notEmpty().withMessage('Delivery address is required'),
    
  body('deliveryContactNumber')
    .trim()
    .notEmpty().withMessage('Delivery contact number is required'),
    
  body('deliveryCountry')
    .trim()
    .notEmpty().withMessage('Delivery country is required'),
    
  body('deliveryState')
    .trim()
    .notEmpty().withMessage('Delivery state is required'),
    
  body('deliveryCity')
    .trim()
    .notEmpty().withMessage('Delivery city is required'),
    
  // Package Details
  body('packageDescription')
    .trim()
    .notEmpty().withMessage('Package description is required'),
    
  body('weightKg')
    .notEmpty().withMessage('Package weight is required')
    .isNumeric().withMessage('Weight must be a numeric value')
    .custom(value => value > 0).withMessage('Weight must be greater than zero'),
    
  // Pricing Information
  body('hasPackageDiscount')
    .optional()
    .isBoolean().withMessage('Package discount must be a boolean'),
    
  // Apply validation
  handleValidationErrors
];

/**
 * Validate package ID parameter
 */
const validatePackageId = [
  param('id')
    .isNumeric().withMessage('Package ID must be a number'),
    
  // Apply validation
  handleValidationErrors
];

/**
 * Validate package update data
 */
const validateUpdatePackage = [
  // Pickup Information
  body('pickupAddress')
    .optional()
    .trim()
    .notEmpty().withMessage('Pickup address cannot be empty'),
    
  body('pickupContactNumber')
    .optional()
    .trim()
    .notEmpty().withMessage('Pickup contact number cannot be empty'),
    
  body('pickupCountry')
    .optional()
    .trim()
    .notEmpty().withMessage('Pickup country cannot be empty'),
    
  body('pickupState')
    .optional()
    .trim()
    .notEmpty().withMessage('Pickup state cannot be empty'),
    
  body('pickupCity')
    .optional()
    .trim()
    .notEmpty().withMessage('Pickup city cannot be empty'),
  
  // Delivery Information
  body('deliveryAddress')
    .optional()
    .trim()
    .notEmpty().withMessage('Delivery address cannot be empty'),
    
  body('deliveryContactNumber')
    .optional()
    .trim()
    .notEmpty().withMessage('Delivery contact number cannot be empty'),
    
  body('deliveryCountry')
    .optional()
    .trim()
    .notEmpty().withMessage('Delivery country cannot be empty'),
    
  body('deliveryState')
    .optional()
    .trim()
    .notEmpty().withMessage('Delivery state cannot be empty'),
    
  body('deliveryCity')
    .optional()
    .trim()
    .notEmpty().withMessage('Delivery city cannot be empty'),
    
  // Package Details
  body('packageDescription')
    .optional()
    .trim()
    .notEmpty().withMessage('Package description cannot be empty'),
    
  body('weightKg')
    .optional()
    .isNumeric().withMessage('Weight must be a numeric value')
    .custom(value => value > 0).withMessage('Weight must be greater than zero'),
    
  // Pricing Information
  body('hasPackageDiscount')
    .optional()
    .isBoolean().withMessage('Package discount must be a boolean'),
    
  // Apply validation
  handleValidationErrors
];

module.exports = {
  validateCreatePackage,
  validatePackageId,
  validateUpdatePackage
};