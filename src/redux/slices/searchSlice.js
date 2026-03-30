import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tmdbApi from 'services/tmdbApi';

// Async thunks for search functionality
export const searchMedia = createAsyncThunk(
  'search/searchMedia',
  async ({ query, type = 'multi', page = 1 }, { rejectWithValue }) => {
    try {
      if (!query || query.trim() === '') {
        return rejectWithValue('Please enter a search term');
      }
      
      console.log(`Searching for "${query}" in type "${type}" (page ${page})`);
      const response = await tmdbApi.search(query, type, page);
      
      console.log('Search results:', response.data);
      return {
        results: response.data.results,
        page,
        totalPages: response.data.total_pages,
        query,
        type
      };
    } catch (error) {
      console.error('Search error:', error);
      return rejectWithValue(
        error.response?.data?.status_message || 
        error.message || 
        'An error occurred while searching. Please try again.'
      );
    }
  }
);

export const fetchGenres = createAsyncThunk(
  'search/fetchGenres',
  async (mediaType, { rejectWithValue }) => {
    try {
      const response = await tmdbApi.getGenres(mediaType);
      return {
        genres: response.data.genres,
        mediaType
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Search slice
const searchSlice = createSlice({
  name: 'search',
  initialState: {
    results: [],
    query: '',
    currentType: 'multi',
    page: 1,
    totalPages: 0,
    movieGenres: [],
    tvGenres: [],
    status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {
    clearSearchResults: (state) => {
      state.results = [];
      state.query = '';
      state.page = 1;
      state.totalPages = 0;
    },
    setSearchType: (state, action) => {
      state.currentType = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Search
      .addCase(searchMedia.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchMedia.fulfilled, (state, action) => {
        const { results, page, totalPages, query, type } = action.payload;
        state.query = query;
        state.currentType = type;
        
        if (page === 1) {
          state.results = results;
        } else {
          state.results = [...state.results, ...results];
        }
        
        state.page = page;
        state.totalPages = totalPages;
        state.status = 'succeeded';
      })
      .addCase(searchMedia.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Fetch genres
      .addCase(fetchGenres.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        const { genres, mediaType } = action.payload;
        if (mediaType === 'movie') {
          state.movieGenres = genres;
        } else {
          state.tvGenres = genres;
        }
        state.status = 'succeeded';
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearSearchResults, setSearchType } = searchSlice.actions;
export default searchSlice.reducer;
