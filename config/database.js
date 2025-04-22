// config/database.js

const { Sequelize } = require('sequelize');

// Get database connection details from environment variables
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;

// Create a new Sequelize instance for MySQL
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: false,
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
    console.log('✅ Connected to the MySQL database successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the MySQL database:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection
};
