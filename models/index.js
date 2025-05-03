/**
 * Models Index
 * Exports all database models and establishes relationships
 */
require('dotenv').config();

const { sequelize } = require('../config/database');
const User = require('./User');
const Package = require('./Package');
const Subscription = require('./Subscription');

// Define relationships if not already defined in individual model files
// User.hasMany(Package, { foreignKey: 'userId', as: 'packages' });
// Package.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Sync all models with the database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');
    return true;
  } catch (error) {
    console.error('Failed to sync database:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  User,
  Package,
  Subscription,
  syncDatabase
};