import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchGenres } from 'redux/slices/searchSlice';
import Layout from 'components/layout/Layout';
import HomePage from 'pages/HomePage';
import MoviesPage from 'pages/MoviesPage';
import TvShowsPage from 'pages/TvShowsPage';
import TrendingPage from 'pages/TrendingPage';
import MovieDetailPage from 'pages/MovieDetailPage';
import TvShowDetailPage from 'pages/TvShowDetailPage';
import SearchPage from 'pages/SearchPage';
import GenresPage from 'pages/GenresPage';
import TermsOfServicePage from 'pages/TermsOfServicePage';
import PrivacyPolicyPage from 'pages/PrivacyPolicyPage';
import DisclaimerPage from 'pages/DisclaimerPage';
import ContactPage from 'pages/ContactPage';
import './App.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch movie and TV genres on app initialization
    dispatch(fetchGenres('movie'));
    dispatch(fetchGenres('tv'));
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/tv-shows" element={<TvShowsPage />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/genre/:genreName" element={<GenresPage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/tv/:id" element={<TvShowDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
