const tmdbService = require('../services/tmdbService');

// Get trending movies
const getTrendingMovies = async (req, res) => {
  try {
    const { timeWindow } = req.params;
    
    if (!['day', 'week'].includes(timeWindow)) {
      return res.status(400).json({ 
        error: 'Invalid time window. Must be day or week' 
      });
    }
    
    const data = await tmdbService.getTrending('movie', timeWindow);
    res.json(data);
    
  } catch (error) {
    console.error('Error in getTrendingMovies:', error);
    res.status(500).json({ 
      error: 'Failed to fetch trending movies',
      message: error.message 
    });
  }
};

// Get trending TV shows
const getTrendingTvShows = async (req, res) => {
  try {
    const { timeWindow } = req.params;
    
    if (!['day', 'week'].includes(timeWindow)) {
      return res.status(400).json({ 
        error: 'Invalid time window. Must be day or week' 
      });
    }
    
    const data = await tmdbService.getTrending('tv', timeWindow);
    res.json(data);
    
  } catch (error) {
    console.error('Error in getTrendingTvShows:', error);
    res.status(500).json({ 
      error: 'Failed to fetch trending TV shows',
      message: error.message 
    });
  }
};

// Get movies by category
const getMoviesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1 } = req.query;
    
    const validCategories = ['now_playing', 'popular', 'top_rated', 'upcoming'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: 'Invalid movie category',
        validCategories
      });
    }
    
    const data = await tmdbService.getMovies(category, page);
    res.json(data);
    
  } catch (error) {
    console.error('Error in getMoviesByCategory:', error);
    res.status(500).json({ 
      error: 'Failed to fetch movies',
      message: error.message 
    });
  }
};

// Get TV shows by category
const getTvShowsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1 } = req.query;
    
    const validCategories = ['airing_today', 'on_the_air', 'popular', 'top_rated'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: 'Invalid TV show category',
        validCategories
      });
    }
    
    const data = await tmdbService.getTvShows(category, page);
    res.json(data);
    
  } catch (error) {
    console.error('Error in getTvShowsByCategory:', error);
    res.status(500).json({ 
      error: 'Failed to fetch TV shows',
      message: error.message 
    });
  }
};

// Get movie details
const getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid movie ID' });
    }
    
    const data = await tmdbService.getMovieDetails(id);
    res.json(data);
    
  } catch (error) {
    console.error('Error in getMovieDetails:', error);
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: 'Movie not found' });
    } else {
      res.status(500).json({ 
        error: 'Failed to fetch movie details',
        message: error.message 
      });
    }
  }
};

// Get TV show details
const getTvShowDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid TV show ID' });
    }
    
    const data = await tmdbService.getTvShowDetails(id);
    res.json(data);
    
  } catch (error) {
    console.error('Error in getTvShowDetails:', error);
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: 'TV show not found' });
    } else {
      res.status(500).json({ 
        error: 'Failed to fetch TV show details',
        message: error.message 
      });
    }
  }
};

// Search content
const searchContent = async (req, res) => {
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
    
    const data = await tmdbService.searchContent(type, query, page);
    res.json(data);
    
  } catch (error) {
    console.error('Error in searchContent:', error);
    res.status(500).json({ 
      error: 'Failed to search content',
      message: error.message 
    });
  }
};

// Get genres
const getGenres = async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!['movie', 'tv'].includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid type. Must be movie or tv' 
      });
    }
    
    const data = await tmdbService.getGenres(type);
    res.json(data);
    
  } catch (error) {
    console.error('Error in getGenres:', error);
    res.status(500).json({ 
      error: 'Failed to fetch genres',
      message: error.message 
    });
  }
};

// Discover content
const discoverContent = async (req, res) => {
  try {
    const { type } = req.params;
    const filters = req.query;
    
    if (!['movie', 'tv'].includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid type. Must be movie or tv' 
      });
    }
    
    const data = await tmdbService.discoverContent(type, filters);
    res.json(data);
    
  } catch (error) {
    console.error('Error in discoverContent:', error);
    res.status(500).json({ 
      error: 'Failed to discover content',
      message: error.message 
    });
  }
};

module.exports = {
  getTrendingMovies,
  getTrendingTvShows,
  getMoviesByCategory,
  getTvShowsByCategory,
  getMovieDetails,
  getTvShowDetails,  
  searchContent,
  getGenres,
  discoverContent
};