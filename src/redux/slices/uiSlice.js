import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tmdbApi from 'services/tmdbApi';

// Async thunk to fetch videos for a specific movie or TV show
export const fetchVideosAndPlayTrailer = createAsyncThunk(
  'ui/fetchVideosAndPlayTrailer',
  async ({ id, mediaType }, { dispatch, rejectWithValue, getState }) => {
    try {
      console.log(`[Trailer] Fetching videos for ${mediaType} with ID ${id}`);
      
      if (!id || !mediaType) {
        console.error('[Trailer] Invalid id or mediaType:', { id, mediaType });
        return rejectWithValue('Invalid id or mediaType');
      }
      
      const response = await tmdbApi.getVideos(id, mediaType);
      console.log('[Trailer] API response:', response);
      
      const videos = response.data.results;
      console.log('[Trailer] Videos fetched:', videos);
      
      if (videos && videos.length > 0) {
        // Log all videos for debugging
        console.log('[Trailer] All videos:', videos.map(v => ({
          name: v.name, 
          type: v.type, 
          site: v.site, 
          key: v.key
        })));
        
        // First try to find official trailers
        let trailers = videos.filter(
          video => video.type === 'Trailer' && video.site === 'YouTube' && video.official
        );
        
        // If no official trailers, try any trailers
        if (trailers.length === 0) {
          trailers = videos.filter(
            video => video.type === 'Trailer' && video.site === 'YouTube'
          );
        }
        
        // If still no trailers, try teasers
        if (trailers.length === 0) {
          trailers = videos.filter(
            video => video.type === 'Teaser' && video.site === 'YouTube'
          );
        }
        
        // If still nothing, try any YouTube video
        if (trailers.length === 0) {
          trailers = videos.filter(video => video.site === 'YouTube');
        }
        
        console.log('[Trailer] Filtered trailers:', trailers);
        
        const trailerKey = trailers.length > 0 
          ? trailers[0].key 
          : null;
        
        console.log('[Trailer] Selected trailer key:', trailerKey);
        
        if (trailerKey) {
          console.log('[Trailer] Dispatching playTrailer with key:', trailerKey);
          dispatch(playTrailer(trailerKey));
          
          // Check if the state was updated
          const updatedState = getState();
          console.log('[Trailer] Updated state after dispatch:', {
            isTrailerPlaying: updatedState.ui.isTrailerPlaying,
            currentTrailerKey: updatedState.ui.currentTrailerKey
          });
          
          return { success: true, trailerKey };
        } else {
          console.warn('[Trailer] No valid YouTube trailer key found');
        }
      } else {
        console.warn('[Trailer] No videos found for this item');
      }
      
      return rejectWithValue('No trailers found');
    } catch (error) {
      console.error('[Trailer] Error fetching videos:', error);
      return rejectWithValue(error.message || 'Failed to fetch videos');
    }
  }
);

// UI slice for app-wide UI state
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isDarkMode: true,
    isNavOpen: false,
    isTrailerPlaying: false,
    currentTrailerKey: null,
    notifications: [],
    serverSelection: 'server1', // default streaming server
    loading: false,
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    toggleNav: (state) => {
      state.isNavOpen = !state.isNavOpen;
    },
    closeNav: (state) => {
      state.isNavOpen = false;
    },
    playTrailer: (state, action) => {
      state.isTrailerPlaying = true;
      state.currentTrailerKey = action.payload;
    },
    closeTrailer: (state) => {
      state.isTrailerPlaying = false;
      state.currentTrailerKey = null;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    setServer: (state, action) => {
      state.serverSelection = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { 
  toggleDarkMode,
  toggleNav,
  closeNav,
  playTrailer,
  closeTrailer,
  addNotification,
  removeNotification,
  setServer,
  setLoading
} = uiSlice.actions;

export default uiSlice.reducer;
