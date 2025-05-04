const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Subscription = sequelize.define('Subscription', {
  planName: {
    type: DataTypes.STRING,
    defaultValue: 'basic',
  },
  startDate: DataTypes.DATE,
  endDate: DataTypes.DATE,
  packageLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 15,
  },
  packagesUsed: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});


module.exports = Subscription;