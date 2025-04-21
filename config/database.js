/**
 * Database Configuration
 * Sets up Sequelize ORM with PostgreSQL database
 */

const { Sequelize } = require('sequelize');

// Get database connection details from environment variables
const dbName = process.env.PGDATABASE;
const dbUser = process.env.PGUSER;
const dbPassword = process.env.PGPASSWORD;
const dbHost = process.env.PGHOST;
const dbPort = process.env.PGPORT;

// Create a new Sequelize instance
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  logging: false, // Set to console.log to see SQL queries
  dialectOptions: {
    ssl: false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test the database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection
};