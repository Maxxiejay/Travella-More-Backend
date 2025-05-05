// models/Subscription.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Subscription = sequelize.define('Subscription', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  plan: {
    type: DataTypes.ENUM('basic', 'standard', 'premium'),
    allowNull: false
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'cancelled'),
    defaultValue: 'active'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  paymentReference: {
    type: DataTypes.STRING,
    unique: true
  }
}, {
  timestamps: true
});

// // Define associations
// Subscription.belongsTo(User, { foreignKey: 'userId', as: 'user' });
// User.hasMany(Subscription, { foreignKey: 'userId', as: 'subscriptions' });

module.exports = Subscription;