import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMoviesByGenre } from '../redux/slices/moviesSlice';
import { fetchTvShowsByGenre } from '../redux/slices/tvShowsSlice';
import MediaGrid from '../components/common/MediaGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';

const GenresPage = () => {
  const { genreName } = useParams();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('movies');
  
  // Get genres from Redux store
  const { movieGenres, tvGenres } = useSelector((state) => state.search);
  const { byGenre: moviesByGenre, status: moviesStatus } = useSelector((state) => state.movies);
  const { byGenre: tvShowsByGenre, status: tvShowsStatus } = useSelector((state) => state.tvShows);

  // Map genre names to TMDB genre IDs
  const genreMapping = {
    'action': { movie: 28, tv: 10759 },
    'comedy': { movie: 35, tv: 35 },
    'drama': { movie: 18, tv: 18 },
    'horror': { movie: 27, tv: 9648 },
    'sci-fi': { movie: 878, tv: 10765 },
    'thriller': { movie: 53, tv: 9648 },
    'romance': { movie: 10749, tv: 10749 },
    'adventure': { movie: 12, tv: 10759 },
    'family': { movie: 10751, tv: 10751 },
    'fantasy': { movie: 14, tv: 10765 },
    'mystery': { movie: 9648, tv: 9648 },
    'crime': { movie: 80, tv: 80 },
    'documentary': { movie: 99, tv: 99 },
    'animation': { movie: 16, tv: 16 },
    'music': { movie: 10402, tv: 10402 },
    'war': { movie: 10752, tv: 10768 },
    'western': { movie: 37, tv: 37 }
  };

  // Get genre ID from name
  const getGenreId = (genreName, mediaType) => {
    const normalizedName = genreName.toLowerCase().replace(/-/g, '-');
    return genreMapping[normalizedName]?.[mediaType];
  };

  // Find genre name from genres list
  const findGenreFromList = (genreName, genresList) => {
    const normalizedSearchName = genreName.toLowerCase().replace(/-/g, ' ');
    return genresList.find(genre => 
      genre.name.toLowerCase() === normalizedSearchName ||
      genre.name.toLowerCase().replace(/\s+/g, '-') === genreName.toLowerCase()
    );
  };

  // Get current genre info
  const getCurrentGenre = () => {
    if (activeTab === 'movies') {
      return findGenreFromList(genreName, movieGenres) || 
             { id: getGenreId(genreName, 'movie'), name: genreName.charAt(0).toUpperCase() + genreName.slice(1) };
    } else {
      return findGenreFromList(genreName, tvGenres) || 
             { id: getGenreId(genreName, 'tv'), name: genreName.charAt(0).toUpperCase() + genreName.slice(1) };
    }
  };

  const currentGenre = getCurrentGenre();

  useEffect(() => {
    if (currentGenre?.id) {
      if (activeTab === 'movies') {
        dispatch(fetchMoviesByGenre({ genreId: currentGenre.id, page: 1 }));
      } else {
        dispatch(fetchTvShowsByGenre({ genreId: currentGenre.id, page: 1 }));
      }
    }
  }, [dispatch, currentGenre?.id, activeTab]);

  const getCurrentContent = () => {
    if (activeTab === 'movies') {
      return moviesByGenre[currentGenre?.id] || [];
    } else {
      return tvShowsByGenre[currentGenre?.id] || [];
    }
  };

  const isLoading = moviesStatus === 'loading' || tvShowsStatus === 'loading';
  const content = getCurrentContent();

  // Format genre name for display
  const formatGenreName = (name) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (!currentGenre?.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark via-dark-lighter to-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-white mb-4">Genre Not Found</h1>
            <p className="text-gray-300">Sorry, we couldn't find the genre "{formatGenreName(genreName)}".</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-lighter to-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {formatGenreName(genreName)} {activeTab === 'movies' ? 'Movies' : 'TV Shows'}
          </h1>
          <p className="text-gray-300">
            Explore the best {formatGenreName(genreName).toLowerCase()} {activeTab} available
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-4 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('movies')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'movies'
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => setActiveTab('tv')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'tv'
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              TV Shows
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingSpinner />
        ) : content.length > 0 ? (
          <MediaGrid items={content} mediaType={activeTab === 'movies' ? 'movie' : 'tv'} />
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-white mb-2">
              No {activeTab} found
            </h3>
            <p className="text-gray-300">
              No {activeTab} available in the {formatGenreName(genreName)} genre.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenresPage;