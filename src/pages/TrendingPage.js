import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrendingMovies } from '../redux/slices/moviesSlice';
import { fetchTrendingTvShows } from '../redux/slices/tvShowsSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MediaGrid from '../components/common/MediaGrid';
import HeroSection from '../components/common/HeroSection';

const TrendingPage = () => {
  const dispatch = useDispatch();
  const moviesState = useSelector((state) => state.movies);
  const tvShowsState = useSelector((state) => state.tvShows);
  const [activeMediaType, setActiveMediaType] = useState('movie');
  const [timeWindow, setTimeWindow] = useState('day');
  const [isLoading, setIsLoading] = useState(false);

  // Effect to fetch initial data when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTrending();
  }, [activeMediaType, timeWindow]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch trending content based on mediaType and timeWindow
  const fetchTrending = () => {
    setIsLoading(true);
    
    if (activeMediaType === 'movie') {
      dispatch(fetchTrendingMovies(timeWindow))
        .finally(() => setIsLoading(false));
    } else {
      dispatch(fetchTrendingTvShows(timeWindow))
        .finally(() => setIsLoading(false));
    }
  };

  // Get items to display
  const getItemsToDisplay = () => {
    if (activeMediaType === 'movie') {
      return moviesState.trending;
    } else {
      return tvShowsState.trending;
    }
  };

  // Get loading state
  const isInitialLoading = 
    (activeMediaType === 'movie' && moviesState.status === 'loading') || 
    (activeMediaType === 'tv' && tvShowsState.status === 'loading');

  // Get error state
  const error = 
    (activeMediaType === 'movie' && moviesState.error) || 
    (activeMediaType === 'tv' && tvShowsState.error);

  const itemsToDisplay = getItemsToDisplay();

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <HeroSection 
        title="Trending"
        subtitle="Discover what's hot right now in movies and TV shows"
        imageUrl="/hero-trending.jpg"
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <span className="text-white font-medium">Show:</span>
            <div className="flex rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveMediaType('movie')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeMediaType === 'movie'
                    ? 'bg-accent text-white'
                    : 'bg-secondary text-gray-300 hover:bg-gray-700'
                }`}
              >
                Movies
              </button>
              <button
                onClick={() => setActiveMediaType('tv')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeMediaType === 'tv'
                    ? 'bg-accent text-white'
                    : 'bg-secondary text-gray-300 hover:bg-gray-700'
                }`}
              >
                TV Shows
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-white font-medium">Time Period:</span>
            <div className="flex rounded-lg overflow-hidden">
              <button
                onClick={() => setTimeWindow('day')}
                className={`px-4 py-2 text-sm font-medium ${
                  timeWindow === 'day'
                    ? 'bg-accent text-white'
                    : 'bg-secondary text-gray-300 hover:bg-gray-700'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setTimeWindow('week')}
                className={`px-4 py-2 text-sm font-medium ${
                  timeWindow === 'week'
                    ? 'bg-accent text-white'
                    : 'bg-secondary text-gray-300 hover:bg-gray-700'
                }`}
              >
                This Week
              </button>
            </div>
          </div>
        </div>
        
        {/* Content Grid */}
        {isInitialLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="large" />
          </div>
        ) : error ? (
          <div className="bg-red-900 bg-opacity-50 p-6 rounded-lg text-center my-8">
            <h2 className="text-xl text-white mb-2">Error Loading Content</h2>
            <p className="text-red-200">{error}</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Trending {activeMediaType === 'movie' ? 'Movies' : 'TV Shows'} {timeWindow === 'day' ? 'Today' : 'This Week'}
            </h2>
            
            <MediaGrid items={itemsToDisplay} mediaType={activeMediaType} />
            
            {(!itemsToDisplay || itemsToDisplay.length === 0) && !isLoading && (
              <div className="flex justify-center py-12">
                <p className="text-gray-400">No trending content found. Please try a different filter.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TrendingPage;
