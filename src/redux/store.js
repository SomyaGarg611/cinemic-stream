import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from 'redux/slices/moviesSlice';
import tvShowsReducer from 'redux/slices/tvShowsSlice';
import searchReducer from 'redux/slices/searchSlice';
import uiReducer from 'redux/slices/uiSlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    tvShows: tvShowsReducer,
    search: searchReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;
