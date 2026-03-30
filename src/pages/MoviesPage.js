import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMoviesByCategory } from '../redux/slices/moviesSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MediaGrid from '../components/common/MediaGrid';
import HeroSection from '../components/common/HeroSection';

// Map API category names to Redux state properties (moved outside component)
const categoryToStateMap = {
  'now_playing': 'nowPlaying',
  'popular': 'popular', 
  'top_rated': 'topRated',
  'upcoming': 'upcoming'
};

const MoviesPage = () => {
  const dispatch = useDispatch();
  const { nowPlaying, popular, topRated, upcoming, status, error } = useSelector((state) => state.movies);
  const [activeCategory, setActiveCategory] = useState('popular');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Map of categories to display names
  const categoryMap = {
    'now_playing': 'Now Playing',
    'popular': 'Popular',
    'top_rated': 'Top Rated',
    'upcoming': 'Upcoming'
  };

  // Get movies for active category
  const getMoviesForCategory = () => {
    const stateProperty = categoryToStateMap[activeCategory] || 'popular';
    
    console.log(`Getting movies for category: ${activeCategory}`);
    console.log(`Mapped to state property: ${stateProperty}`);
    console.log('Available movies in state:', {
      nowPlaying: nowPlaying?.length || 0,
      popular: popular?.length || 0,
      topRated: topRated?.length || 0,
      upcoming: upcoming?.length || 0
    });
    
    return stateProperty === 'nowPlaying' ? nowPlaying :
           stateProperty === 'popular' ? popular :
           stateProperty === 'topRated' ? topRated :
           stateProperty === 'upcoming' ? upcoming :
           [];
  };

  // Effect to fetch initial data when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Fetch the active category if specified
    if (activeCategory && page === 1) {
      dispatch(fetchMoviesByCategory({ category: activeCategory, page: 1 }));
    }
  }, [dispatch, activeCategory, page]);
  
  // Additional effect to prefetch all categories on initial load
  useEffect(() => {
    const allCategories = ['popular', 'top_rated', 'now_playing', 'upcoming'];
    
    // Prefetch all categories that don't have data yet
    allCategories.forEach(category => {
      const stateProperty = categoryToStateMap[category];
      const existingData = stateProperty === 'nowPlaying' ? nowPlaying :
                           stateProperty === 'popular' ? popular :
                           stateProperty === 'topRated' ? topRated :
                           stateProperty === 'upcoming' ? upcoming : null;
      
      if (!existingData || existingData.length === 0) {
        console.log(`Prefetching category: ${category}`);
        dispatch(fetchMoviesByCategory({ category, page: 1 }));
      }
    });
  }, [dispatch, nowPlaying, popular, topRated, upcoming]);

  // Handle category change
  const handleCategoryChange = (category) => {
    console.log(`Changing category to: ${category}`);
    window.scrollTo(0, 0);
    setActiveCategory(category);
    setPage(1);
    
    // Check if we already have data for this category
    const stateProperty = categoryToStateMap[category];
    const existingData = stateProperty === 'nowPlaying' ? nowPlaying :
                         stateProperty === 'popular' ? popular :
                         stateProperty === 'topRated' ? topRated :
                         stateProperty === 'upcoming' ? upcoming : null;
    
    console.log(`Category ${category} maps to state property ${stateProperty}`);
    console.log(`Existing data length: ${existingData?.length || 0}`);
    
    if (!existingData || existingData.length === 0) {
      console.log(`Fetching data for category: ${category}`);
      dispatch(fetchMoviesByCategory({ category, page: 1 }));
    }
  };

  // Load more movies for current category
  const loadMore = () => {
    setIsLoading(true);
    const nextPage = page + 1;
    setPage(nextPage);
    
    dispatch(fetchMoviesByCategory({ category: activeCategory, page: nextPage }))
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Get the movies to display
  const moviesToDisplay = getMoviesForCategory();
  const isInitialLoading = status === 'loading' && page === 1;

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <HeroSection 
        title="Movies"
        subtitle="Discover the latest and greatest films from around the world"
        imageUrl="/hero-movies.jpg"
      />
      
      {/* Category Selector */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-8">
          {Object.keys(categoryMap).map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-accent text-white'
                  : 'bg-secondary text-gray-300 hover:bg-gray-700'
              }`}
            >
              {categoryMap[category]}
            </button>
          ))}
        </div>
        
        {/* Movies Grid */}
        {isInitialLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="large" />
          </div>
        ) : error ? (
          <div className="bg-red-900 bg-opacity-50 p-6 rounded-lg text-center my-8">
            <h2 className="text-xl text-white mb-2">Error Loading Movies</h2>
            <p className="text-red-200">{error}</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-white mb-6">
              {categoryMap[activeCategory]} Movies
            </h2>
            
            <MediaGrid items={moviesToDisplay} mediaType="movie" />
            
            {/* Load More Button */}
            {moviesToDisplay && moviesToDisplay.length > 0 && (
              <div className="flex justify-center mt-8 mb-12">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-full flex items-center space-x-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin h-5 w-5 border-t-2 border-l-2 border-white rounded-full mr-2"></span>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>Load More</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;
