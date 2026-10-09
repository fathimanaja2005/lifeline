const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/donors', require('./routes/donorRoutes'));
app.use('/api/camps', require('./routes/campRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Lifeline Blood Bank Management API is running',
    version: '1.0.0',
    endpoints: [
      '/api/auth',
      '/api/inventory',
      '/api/requests',
      '/api/donors',
      '/api/camps',
      '/api/analytics',
    ],
  });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

// Start Server & Connect to DB
const { autoSeedIfEmpty } = require('./utils/seedData');

const startServer = async () => {
  try {
    await connectDB();
    await autoSeedIfEmpty();
    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(` Lifeline Blood Bank API Server running on port ${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(` Endpoint: http://localhost:${PORT}`);
      console.log(`======================================================\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
