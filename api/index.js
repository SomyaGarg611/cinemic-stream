// Vercel Serverless Function Entry Point
// Production-ready API for Cinemic

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://cinemic.vercel.app', 'https://*.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Key from environment
const API_KEY = process.env.TMDB_API_KEY;

// Helper function for TMDB requests with better error handling
async function makeTMDBRequest(endpoint, params = {}) {
  if (!API_KEY) {
    throw new Error('TMDB_API_KEY environment variable is required');
  }
  
  const url = `https://api.themoviedb.org/3${endpoint}`;
  const fullParams = {
    api_key: API_KEY,
    language: 'en-US',
    ...params
  };
  
  try {
    const response = await axios.get(url, {
      params: fullParams,
      timeout: 25000,
      headers: {
        'User-Agent': 'Cinemic-App/1.0',
        'Accept': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`TMDB API Error for ${endpoint}:`, error.message);
    throw new Error(`Failed to fetch data from TMDB: ${error.message}`);
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    tmdb_key_configured: !!API_KEY
  });
});

// TMDB Endpoints
app.get('/api/tmdb/movies/popular', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const data = await makeTMDBRequest('/movie/popular', { page });
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch popular movies',
      message: error.message 
    });
  }
});

app.get('/api/tmdb/trending/movie/:timeWindow', async (req, res) => {
  try {
    const { timeWindow } = req.params;
    if (!['day', 'week'].includes(timeWindow)) {
      return res.status(400).json({ error: 'Invalid time window. Use day or week.' });
    }
    
    const data = await makeTMDBRequest(`/trending/movie/${timeWindow}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch trending movies',
      message: error.message 
    });
  }
});

app.get('/api/tmdb/trending/tv/:timeWindow', async (req, res) => {
  try {
    const { timeWindow } = req.params;
    if (!['day', 'week'].includes(timeWindow)) {
      return res.status(400).json({ error: 'Invalid time window. Use day or week.' });
    }
    
    const data = await makeTMDBRequest(`/trending/tv/${timeWindow}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch trending TV shows',
      message: error.message 
    });
  }
});

app.get('/api/tmdb/movies/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const page = req.query.page || 1;
    
    const validCategories = ['now_playing', 'popular', 'top_rated', 'upcoming'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        error: 'Invalid category',
        validCategories 
      });
    }
    
    const data = await makeTMDBRequest(`/movie/${category}`, { page });
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch movies',
      message: error.message 
    });
  }
});

app.get('/api/tmdb/movie/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid movie ID' });
    }
    
    const data = await makeTMDBRequest(`/movie/${id}`, {
      append_to_response: 'videos,credits,recommendations,similar'
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch movie details',
      message: error.message 
    });
  }
});

app.get('/api/tmdb/tv/:id/season/:seasonNumber', async (req, res) => {
  try {
    const { id, seasonNumber } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid TV show ID' });
    }
    
    if (!seasonNumber || isNaN(seasonNumber)) {
      return res.status(400).json({ error: 'Invalid season number' });
    }
    
    const data = await makeTMDBRequest(`/tv/${id}/season/${seasonNumber}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch TV show season details',
      message: error.message 
    });
  }
});

app.get('/api/tmdb/tv/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid TV show ID' });
    }
    
    const data = await makeTMDBRequest(`/tv/${id}`, {
      append_to_response: 'videos,credits,recommendations,similar'
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch TV show details',
      message: error.message 
    });
  }
});

app.get('/api/tmdb/tv/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const page = req.query.page || 1;
    
    const validCategories = ['airing_today', 'on_the_air', 'popular', 'top_rated'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        error: 'Invalid category',
        validCategories 
      });
    }
    
    const data = await makeTMDBRequest(`/tv/${category}`, { page });
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch TV shows',
      message: error.message 
    });
  }
});

app.get('/api/tmdb/search/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { query, page = 1 } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({ 
        error: 'Search query must be at least 2 characters long' 
      });
    }
    
    const validTypes = ['movie', 'tv', 'person', 'multi'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid search type',
        validTypes 
      });
    }
    
    const endpoint = type === 'multi' ? '/search/multi' : `/search/${type}`;
    const data = await makeTMDBRequest(endpoint, { query, page });
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to search content',
      message: error.message 
    });
  }
});

app.get('/api/tmdb/genres/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const data = await makeTMDBRequest(`/genre/${type}/list`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch genres',
      message: error.message 
    });
  }
});

// Email test endpoint (simplified for production)
app.get('/api/email/test', (req, res) => {
  res.json({ 
    message: 'Email service ready', 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Export for Vercel
module.exports = app;