const axios = require('axios');

class TMDBService {
  constructor() {
    this.apiKey = process.env.TMDB_API_KEY;
    this.baseURL = process.env.TMDB_BASE_URL;
    
    if (!this.apiKey) {
      throw new Error('TMDB_API_KEY environment variable is required');
    }
    
    if (!this.baseURL) {
      throw new Error('TMDB_BASE_URL environment variable is required');
    }
    
    console.log('🎬 TMDB Service initialized with key:', this.apiKey.substring(0, 8) + '...');
  }

  // Simple axios request helper
  async makeRequest(endpoint, params = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const fullParams = {
      api_key: this.apiKey,
      language: 'en-US',
      ...params
    };
    
    console.log(`📡 TMDB Request: ${endpoint}`);
    
    try {
      const response = await axios.get(url, {
        params: fullParams,
        timeout: 15000,
        headers: {
          'User-Agent': 'Cinemic-App/1.0',
          'Accept': 'application/json'
        }
      });
      
      console.log(`✅ TMDB Response: ${response.status} - ${response.data.results?.length || 'N/A'} results`);
      return response.data;
      
    } catch (error) {
      console.error(`❌ TMDB Error for ${endpoint}:`, error.message);
      throw error;
    }
  }

  // Get trending content
  async getTrending(mediaType, timeWindow) {
    return await this.makeRequest(`/trending/${mediaType}/${timeWindow}`);
  }

  // Get movies by category
  async getMovies(category, page = 1) {
    return await this.makeRequest(`/movie/${category}`, { page });
  }

  // Get TV shows by category
  async getTvShows(category, page = 1) {
    return await this.makeRequest(`/tv/${category}`, { page });
  }

  // Get movie details
  async getMovieDetails(id) {
    return await this.makeRequest(`/movie/${id}`, {
      append_to_response: 'videos,credits,recommendations,similar'
    });
  }

  // Get TV show details
  async getTvShowDetails(id) {
    return await this.makeRequest(`/tv/${id}`, {
      append_to_response: 'videos,credits,recommendations,similar'
    });
  }

  // Search content
  async searchContent(type, query, page = 1) {
    const endpoint = type === 'multi' ? '/search/multi' : `/search/${type}`;
    return await this.makeRequest(endpoint, { query, page });
  }

  // Get genres
  async getGenres(type) {
    return await this.makeRequest(`/genre/${type}/list`);
  }

  // Discover content
  async discoverContent(type, filters) {
    return await this.makeRequest(`/discover/${type}`, filters);
  }
}

// Create and export a singleton instance
const tmdbService = new TMDBService();
module.exports = tmdbService;