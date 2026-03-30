import axios from 'axios';

// Backend API configuration
// In production (Vercel), use relative path to serverless functions
// In development, use local server on port 5001
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // This points to Vercel serverless functions
  : process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

console.log('API_BASE_URL:', API_BASE_URL, 'Environment:', process.env.NODE_ENV);

// Creating axios instance with base configuration for backend API
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 second timeout (higher than backend timeout)
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('Backend API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Backend API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log('Backend API Response Status:', response.status);
    return response;
  },
  (error) => {
    console.error('Backend API Response Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// API service object with various endpoints
const tmdbApi = {
  // Get trending movies or TV shows
  getTrending: (mediaType, timeWindow) => {
    return api.get(`/tmdb/trending/${mediaType}/${timeWindow}`);
  },
  
  // Get movies by different categories
  getMovies: (category, page = 1) => {
    return api.get(`/tmdb/movies/${category}`, {
      params: { page },
    });
  },
  
  // Get TV shows by different categories
  getTvShows: (category, page = 1) => {
    return api.get(`/tmdb/tv/${category}`, {
      params: { page },
    });
  },
  
  // Get details of a specific movie
  getMovieDetails: (id) => {
    return api.get(`/tmdb/movie/${id}`);
  },
  
  // Get details of a specific TV show
  getTvShowDetails: (id) => {
    return api.get(`/tmdb/tv/${id}`);
  },
  
  // Get TV show season details
  getTvShowSeason: (id, seasonNumber) => {
    return api.get(`/tmdb/tv/${id}/season/${seasonNumber}`);
  },
  
  // Search for movies, TV shows, or people
  search: (query, type = 'multi', page = 1) => {
    console.log(`Backend API Request: Searching for "${query}" (type: ${type}, page: ${page})`);
    
    return api.get(`/tmdb/search/${type}`, {
      params: {
        query,
        page,
      },
    }).catch(error => {
      console.error('Backend API Request failed:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    });
  },
  
  // Get videos (trailers, teasers) for a movie or TV show
  getVideos: (id, mediaType) => {
    console.log(`[Backend API] Getting videos for ${mediaType} with ID ${id}`);
    return api.get(`/tmdb/${mediaType}/${id}/videos`)
      .then(response => {
        console.log(`[Backend API] Videos response:`, response.data);
        return response;
      })
      .catch(error => {
        console.error(`[Backend API] Error fetching videos for ${mediaType} with ID ${id}:`, error);
        throw error;
      });
  },
  
  // Get all available genres
  getGenres: (mediaType) => {
    return api.get(`/tmdb/genres/${mediaType}`);
  },
  
  // Discover movies or TV shows by various filters
  discover: (mediaType, params = {}) => {
    return api.get(`/tmdb/discover/${mediaType}`, {
      params: { ...params },
    });
  },

  // Helper method to get image URL (for backward compatibility)
  getImageUrl: (imagePath, size = 'w500') => {
    const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';
    return imagePath ? `${IMAGE_BASE_URL}/${size}${imagePath}` : null;
  },
};

export default tmdbApi;
