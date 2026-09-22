const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { seedDatabase } = require('./seed');
const portfolioRoutes = require('./routes/portfolioRoutes');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite dev server and production
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve uploaded static assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/portfolios', portfolioRoutes); // alias for explore page

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Developer Portfolio Generator API',
  });
});

// Serve Frontend in Production or if client/dist exists
const clientDistPath = path.join(__dirname, '../client/dist');
const fs = require('fs');

if (process.env.NODE_ENV === 'production' || fs.existsSync(path.join(clientDistPath, 'index.html'))) {
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    // Let API routes and uploaded files pass through without being intercepted
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // Root route info in dev
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to Developer Portfolio Generator API',
      endpoints: {
        health: '/api/health',
        portfolios: '/api/portfolio',
        portfolioByUsername: '/api/portfolio/:username',
        checkUsername: '/api/portfolio/check/:username',
      },
    });
  });
}

// Global Error Handler
app.use(errorHandler);

// Start server after DB connection
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`[Server] Developer Portfolio Generator API running on port ${PORT}`);
      console.log(`[Server] Health check available at http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('[Server Startup Error]', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
