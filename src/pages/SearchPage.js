import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchMedia, setSearchType } from 'redux/slices/searchSlice';
import HeroSection from 'components/common/HeroSection';
import MediaGrid from 'components/common/MediaGrid';
import LoadingSpinner from 'components/common/LoadingSpinner';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';
  
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const { results, currentType, status, error, totalPages } = useSelector(state => state.search);
  
  // Search types for filtering
  const searchTypes = [
    { id: 'multi', label: 'All' },
    { id: 'movie', label: 'Movies' },
    { id: 'tv', label: 'TV Shows' },
    { id: 'person', label: 'People' }
  ];
  
  useEffect(() => {
    // Reset to page 1 when search query changes
    setPage(1);
    
    if (searchQuery) {
      dispatch(searchMedia({ query: searchQuery, type: currentType, page: 1 }));
    }
  }, [dispatch, searchQuery, currentType]);
  
  const handleTypeChange = (type) => {
    dispatch(setSearchType(type));
    // Update URL to reflect search type
    const newParams = new URLSearchParams(location.search);
    newParams.set('type', type);
    navigate(`/search?${newParams.toString()}`);
  };
  
  const handleLoadMore = () => {
    if (page < totalPages) {
      setLoadingMore(true);
      const nextPage = page + 1;
      dispatch(searchMedia({ query: searchQuery, type: currentType, page: nextPage }))
        .then(() => {
          setPage(nextPage);
          setLoadingMore(false);
        })
        .catch((err) => {
          console.error('Error loading more results:', err);
          setLoadingMore(false);
        });
    }
  };
  
  const isLoading = status === 'loading' && !loadingMore;
  const hasMoreResults = page < totalPages;

  return (
    <div>
      <HeroSection title="Search Results">
        <div className="max-w-2xl">
          <div className="mb-6">
            <h2 className="text-xl text-white mb-2">
              {searchQuery ? `Results for "${searchQuery}"` : <span className="hidden md:inline">Enter a search term</span>}
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {searchTypes.map(type => (
              <button
                key={type.id}
                onClick={() => handleTypeChange(type.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  currentType === type.id
                    ? 'bg-accent text-white'
                    : 'bg-secondary text-gray-300 hover:bg-gray-700'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </HeroSection>
      
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <LoadingSpinner size="large" />
        ) : error ? (
          <div className="bg-red-900 bg-opacity-50 p-6 rounded-lg text-center">
            <h2 className="text-xl text-white mb-2">Error</h2>
            <p className="text-red-200">{error}</p>
          </div>
        ) : searchQuery ? (
          <>
            {results.length > 0 ? (
              <>
                <MediaGrid items={results} mediaType={currentType === 'multi' ? null : currentType} />
                
                {/* Load more button */}
                {hasMoreResults && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-full transition-colors disabled:opacity-50"
                    >
                      {loadingMore ? 'Loading...' : 'Load More'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl text-white mb-2">No results found</h3>
                <p className="text-gray-400">
                  We couldn't find anything matching "{searchQuery}". Try different keywords or filters.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl text-white mb-2">Enter a search term</h3>
            <p className="text-gray-400">
              Use the search bar above to find movies, TV shows, or people.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
