// server.js - Main Express server file

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./configs/database');
const productRoutes = require('./routes/productRoutes');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom logger middleware
app.use(logger);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Product API!',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      search: '/api/products/search?q=searchterm',
      stats: '/api/products/stats/category'
    },
    documentation: 'See README.md for full API documentation'
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/products', productRoutes);

// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url}`,
    error: 'Route not found'
  });
});

// Global error handling middleware (must be last)
app.use(errorHandler);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Database: ${process.env.MONGODB_URI}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});

// Export the app for testing purposes
module.exports = app;