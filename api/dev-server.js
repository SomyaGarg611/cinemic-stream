// Development Server - runs API locally on port 5001 (avoiding conflict with React)
// This replaces the need for Vercel CLI during development

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5001; // Changed to 5001 to avoid conflict

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Import API routes from the serverless functions
const apiApp = require('./index.js');
app.use('/', apiApp);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Development API Server running on http://localhost:${PORT}`);
  console.log(`📱 Frontend should use: http://localhost:${PORT}/api`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET  /api/health - Health check');
  console.log('  GET  /api/tmdb/trending/movie/day - Trending movies');
  console.log('  GET  /api/tmdb/movies/popular - Popular movies');
  console.log('  POST /api/email/contact - Contact form');
});