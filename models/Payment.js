import User from './User.js';
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    reference: {
      type: DataTypes.STRING,
      unique: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'success', 'failed'),
      defaultValue: 'pending'
    },
    paymentDate: {
      type: DataTypes.DATE
    },
    metadata: {
      type: DataTypes.JSON
    }
  });
  
  // Add relationships as needed
  Payment.belongsTo(User);