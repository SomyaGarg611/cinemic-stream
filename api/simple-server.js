// Minimal working API server for development
// This bypasses all the complex Express setup and just works

require('dotenv').config();
const http = require('http');
const url = require('url');
const axios = require('axios');

const PORT = 5001;
const API_KEY = process.env.TMDB_API_KEY;

// Helper function to send JSON response
function sendJSON(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// Create server
const server = http.createServer(async (req, res) => {
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    sendJSON(res, {});
    return;
  }
  
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  console.log(`📡 ${req.method} ${path}`);
  
  try {
    
    // Health check
    if (path === '/api/health') {
      sendJSON(res, { 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        api_key: API_KEY ? 'configured' : 'missing'
      });
      return;
    }
    
    // Popular movies
    if (path === '/api/tmdb/movies/popular') {
      console.log('🎬 Fetching popular movies...');
      
      const tmdbUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
      const response = await axios.get(tmdbUrl, { timeout: 30000 });
      
      console.log('✅ Success! Got', response.data.results?.length, 'movies');
      sendJSON(res, response.data);
      return;
    }
    
    // Trending movies
    if (path === '/api/tmdb/trending/movie/day') {
      console.log('🔥 Fetching trending movies...');
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const tmdbUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`;
      const response = await axios.get(tmdbUrl, { 
        timeout: 30000,
        headers: {
          'User-Agent': 'Cinemic-App/1.0'
        }
      });
      
      console.log('✅ Success! Got', response.data.results?.length, 'movies');
      sendJSON(res, response.data);
      return;
    }
    
    // Popular TV shows
    if (path === '/api/tmdb/tv/popular') {
      console.log('📺 Fetching popular TV shows...');
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const page = parsedUrl.query.page || 1;
      const tmdbUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=${page}`;
      const response = await axios.get(tmdbUrl, { 
        timeout: 30000,
        headers: {
          'User-Agent': 'Cinemic-App/1.0'
        }
      });
      
      console.log('✅ Success! Got', response.data.results?.length, 'TV shows');
      sendJSON(res, response.data);
      return;
    }
    
    // Trending TV shows
    if (path === '/api/tmdb/trending/tv/day') {
      console.log('📺 Fetching trending TV shows...');
      
      const tmdbUrl = `https://api.themoviedb.org/3/trending/tv/day?api_key=${API_KEY}&language=en-US`;
      const response = await axios.get(tmdbUrl, { timeout: 30000 });
      
      console.log('✅ Success! Got', response.data.results?.length, 'shows');
      sendJSON(res, response.data);
      return;
    }
    
    // Default 404
    sendJSON(res, { error: 'Endpoint not found' }, 404);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    sendJSON(res, { 
      error: 'Internal server error', 
      message: error.message 
    }, 500);
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Simple API Server running on http://localhost:${PORT}`);
  console.log(`📱 Frontend should connect to: http://localhost:${PORT}/api`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET /api/health');
  console.log('  GET /api/tmdb/movies/popular');
  console.log('  GET /api/tmdb/tv/popular');
  console.log('  GET /api/tmdb/trending/movie/day');
  console.log('  GET /api/tmdb/trending/tv/day');
  console.log('');
  console.log('🔧 API Key:', API_KEY ? 'Configured ✅' : 'Missing ❌');
});