import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tmdbApi from '../../services/tmdbApi';

// Async thunks for fetching movies
export const fetchTrendingMovies = createAsyncThunk(
  'movies/fetchTrending',
  async (timeWindow = 'day', { rejectWithValue }) => {
    try {
      const response = await tmdbApi.getTrending('movie', timeWindow);
      return response.data.results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMoviesByCategory = createAsyncThunk(
  'movies/fetchByCategory',
  async ({ category, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await tmdbApi.getMovies(category, page);
      return {
        results: response.data.results,
        category,
        page,
        totalPages: response.data.total_pages
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await tmdbApi.getMovieDetails(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMoviesByGenre = createAsyncThunk(
  'movies/fetchByGenre',
  async ({ genreId, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await tmdbApi.discover('movie', {
        with_genres: genreId,
        page
      });
      return {
        results: response.data.results,
        genreId,
        page,
        totalPages: response.data.total_pages
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Movie slice
const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    trending: [],
    nowPlaying: [],
    popular: [],
    topRated: [],
    upcoming: [],
    byGenre: {},
    currentMovie: null,
    status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {
    clearCurrentMovie: (state) => {
      state.currentMovie = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Trending movies
      .addCase(fetchTrendingMovies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        state.trending = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchTrendingMovies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Movies by category
      .addCase(fetchMoviesByCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMoviesByCategory.fulfilled, (state, action) => {
        const { results, category, page } = action.payload;
        
        // Map API category names to state property names
        const categoryMap = {
          'now_playing': 'nowPlaying',
          'popular': 'popular',
          'top_rated': 'topRated',
          'upcoming': 'upcoming'
        };
        
        const stateProperty = categoryMap[category] || category;
        
        if (page === 1) {
          state[stateProperty] = results;
        } else {
          state[stateProperty] = [...state[stateProperty], ...results];
        }
        state.status = 'succeeded';
      })
      .addCase(fetchMoviesByCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Movie details
      .addCase(fetchMovieDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.currentMovie = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Movies by genre
      .addCase(fetchMoviesByGenre.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMoviesByGenre.fulfilled, (state, action) => {
        const { results, genreId, page } = action.payload;
        
        if (!state.byGenre[genreId]) {
          state.byGenre[genreId] = [];
        }
        
        if (page === 1) {
          state.byGenre[genreId] = results;
        } else {
          state.byGenre[genreId] = [...state.byGenre[genreId], ...results];
        }
        state.status = 'succeeded';
      })
      .addCase(fetchMoviesByGenre.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearCurrentMovie } = moviesSlice.actions;
export default moviesSlice.reducer;
