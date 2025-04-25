const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');
const packageRoutes = require('./routes/package');
const config = require('./config/config');
const { testConnection, sequelize } = require('./config/database');
const { syncDatabase } = require('./models/index');

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://travella-more.netlify.app']
    : '*',
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
}));
// Allow preflight requests for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);

// Default route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Something went wrong on the server'
  });
});

// Start the server
const PORT = process.env.PORT || 8000;

// Initialize the database connection
const initializeDatabase = async () => {
  try {
    // Test database connection
    const connectionStatus = await testConnection();
    if (!connectionStatus) {
      console.error('Database connection failed. Server will start but functionality may be limited.');
      return false;
    }
    
    // Sync database models
    const syncStatus = await syncDatabase();
    if (!syncStatus) {
      console.error('Database sync failed. Server will start but functionality may be limited.');
      return false;
    }
    
    console.log('Database initialization successful.');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
};

// Start server with database initialization
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeDatabase();
});

module.exports = app;
