/**
 * Package Model
 * Defines the Package schema and methods for interacting with package data
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Package = sequelize.define('Package', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Pickup Information
  pickupAddress: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  pickupContactNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pickupCountry: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pickupState: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pickupCity: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  // Delivery Information
  deliveryAddress: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  deliveryContactNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deliveryCountry: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deliveryState: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deliveryCity: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  // Package Details
  packageDescription: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  weightKg: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  
  // Pricing Information
  hasPackageDiscount: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  
  // Status
  status: {
    type: DataTypes.ENUM('pending', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  }
}, {
  timestamps: true
});

// Define associations
Package.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Package, { foreignKey: 'userId', as: 'packages' });

module.exports = Package;