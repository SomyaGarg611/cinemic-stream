import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tmdbApi from '../../services/tmdbApi';

// Async thunks for fetching TV shows
export const fetchTrendingTvShows = createAsyncThunk(
  'tvShows/fetchTrending',
  async (timeWindow = 'day', { rejectWithValue }) => {
    try {
      const response = await tmdbApi.getTrending('tv', timeWindow);
      return response.data.results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTvShowsByCategory = createAsyncThunk(
  'tvShows/fetchByCategory',
  async ({ category, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await tmdbApi.getTvShows(category, page);
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

export const fetchTvShowDetails = createAsyncThunk(
  'tvShows/fetchDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await tmdbApi.getTvShowDetails(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTvShowSeason = createAsyncThunk(
  'tvShows/fetchSeason',
  async ({ id, seasonNumber }, { rejectWithValue }) => {
    try {
      const response = await tmdbApi.getTvShowSeason(id, seasonNumber);
      return {
        seasonData: response.data,
        seasonNumber
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTvShowsByGenre = createAsyncThunk(
  'tvShows/fetchByGenre',
  async ({ genreId, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await tmdbApi.discover('tv', {
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

// TV Shows slice
const tvShowsSlice = createSlice({
  name: 'tvShows',
  initialState: {
    trending: [],
    airingToday: [],
    onTheAir: [],
    popular: [],
    topRated: [],
    byGenre: {},
    currentShow: null,
    seasons: {},
    status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {
    clearCurrentShow: (state) => {
      state.currentShow = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Trending TV shows
      .addCase(fetchTrendingTvShows.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTrendingTvShows.fulfilled, (state, action) => {
        state.trending = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchTrendingTvShows.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // TV shows by category
      .addCase(fetchTvShowsByCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTvShowsByCategory.fulfilled, (state, action) => {
        const { results, category, page } = action.payload;
        
        // Map API category names to state property names
        const categoryMap = {
          'airing_today': 'airingToday',
          'on_the_air': 'onTheAir',
          'popular': 'popular',
          'top_rated': 'topRated'
        };
        
        const stateProperty = categoryMap[category] || category;
        
        if (page === 1) {
          state[stateProperty] = results;
        } else {
          state[stateProperty] = [...state[stateProperty], ...results];
        }
        state.status = 'succeeded';
      })
      .addCase(fetchTvShowsByCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // TV show details
      .addCase(fetchTvShowDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTvShowDetails.fulfilled, (state, action) => {
        state.currentShow = action.payload;
        state.status = 'succeeded';
        
        // Initialize seasons object for this show if not exist
        if (action.payload.id && !state.seasons[action.payload.id]) {
          state.seasons[action.payload.id] = {};
        }
      })
      .addCase(fetchTvShowDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // TV show season
      .addCase(fetchTvShowSeason.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTvShowSeason.fulfilled, (state, action) => {
        const { seasonData, seasonNumber } = action.payload;
        const showId = state.currentShow?.id;
        
        if (showId) {
          state.seasons[showId][seasonNumber] = seasonData;
        }
        state.status = 'succeeded';
      })
      .addCase(fetchTvShowSeason.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // TV shows by genre
      .addCase(fetchTvShowsByGenre.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTvShowsByGenre.fulfilled, (state, action) => {
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
      .addCase(fetchTvShowsByGenre.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearCurrentShow } = tvShowsSlice.actions;
export default tvShowsSlice.reducer;
