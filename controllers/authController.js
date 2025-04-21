const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const jwtHelper = require('../utils/jwtHelper');

/**
 * User Registration Controller
 * Registers a new user in the system
 */
exports.signup = async (req, res, next) => {
  try {
    const { username, email, password, fullName, mobile, businessName, businessLocation } = req.body;

    // Check if user already exists with the provided email
    const existingUserByEmail = userModel.findByEmail(email);
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Check if username is already taken
    const existingUserByUsername = userModel.findByUsername(username);
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
      password: hashedPassword,
      fullName,
      mobile,
      businessName,
      businessLocation,
      createdAt: new Date()
    };

    // Save the user
    const user = userModel.createUser(newUser);

    // Generate JWT token
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
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName
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
    const user = userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    };

    const token = jwtHelper.generateToken(payload);

    // Return success response with token
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName
      }
    });
  } catch (err) {
    console.error('Signin error:', err);
    next(err);
  }
};

/**
 * Get User Profile Controller
 * Returns user profile data for authenticated users
 */
exports.getProfile = (req, res, next) => {
  try {
    // Get authenticated user ID from request (set by auth middleware)
    const userId = req.user.id;
    
    // Find user in the database
    const user = userModel.findById(userId);
    
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
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Get profile error:', err);
    next(err);
  }
};
