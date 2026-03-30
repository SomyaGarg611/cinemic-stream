import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieDetails } from 'redux/slices/moviesSlice';
import { playTrailer } from 'redux/slices/uiSlice';
import { getImageUrl, formatRuntime, formatDate, formatNumber, getTrailerKey } from 'utils/helpers';
import LoadingSpinner from 'components/common/LoadingSpinner';
import MediaCard from 'components/common/MediaCard';
import StreamingModal from 'components/common/StreamingModal';

const MovieDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentMovie, status, error } = useSelector((state) => state.movies);
  const [activeTab, setActiveTab] = useState('overview');
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      dispatch(fetchMovieDetails(id));
    }
  }, [dispatch, id]);

  const handleTrailerPlay = () => {
    if (currentMovie?.videos?.results) {
      const trailerKey = getTrailerKey(currentMovie.videos.results);
      if (trailerKey) {
        dispatch(playTrailer(trailerKey));
      }
    }
  };
  
  const handleStreamMovie = () => {
    console.log('Stream movie button clicked for:', currentMovie.title);
    setIsStreaming(true);
    
    // Create an event to communicate with the StreamingModal
    const event = new CustomEvent('loadMovie', { 
      detail: { 
        movieData: currentMovie 
      } 
    });
    document.dispatchEvent(event);
  };
  
  const handleCloseStreamingModal = () => {
    console.log('Closing streaming modal');
    setIsStreaming(false);
  };

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-20">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="bg-red-900 bg-opacity-50 p-6 rounded-lg text-center">
          <h2 className="text-xl text-white mb-2">Error Loading Movie</h2>
          <p className="text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  if (!currentMovie) return null;

  const hasTrailer = currentMovie.videos?.results && getTrailerKey(currentMovie.videos.results);
  
  // Get director and top cast
  const director = currentMovie.credits?.crew?.find(person => person.job === 'Director');
  const topCast = currentMovie.credits?.cast?.slice(0, 10) || [];

  return (
    <>
      {/* Streaming Modal */}
      <StreamingModal 
        isOpen={isStreaming} 
        onClose={handleCloseStreamingModal} 
        movie={currentMovie} 
      />
      {/* Movie Banner */}
      <div className="relative">
        <div className="w-full h-[40vh] md:h-[60vh] bg-secondary">
          {currentMovie.backdrop_path && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${getImageUrl(currentMovie.backdrop_path, 'original')})`
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
          
          {/* Content container */}
          <div className="absolute bottom-0 w-full">
            <div className="container mx-auto px-4 pb-8">
              <div className="flex flex-col md:flex-row items-center md:items-end space-y-8 md:space-y-0 md:space-x-8">
                {/* Movie poster */}
                <div className="w-48 md:w-64 flex-shrink-0 relative -mb-20 md:-mb-16">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
                    <img 
                      src={getImageUrl(currentMovie.poster_path, 'w500')} 
                      alt={currentMovie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Movie info */}
                <div className="flex-grow text-center md:text-left pb-4">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                    {currentMovie.title}
                    {currentMovie.release_date && (
                      <span className="text-gray-300 text-lg ml-2">
                        ({new Date(currentMovie.release_date).getFullYear()})
                      </span>
                    )}
                  </h1>
                  
                  {/* Movie metadata */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-1 mt-3 text-sm text-gray-300">
                    {currentMovie.release_date && (
                      <span>{formatDate(currentMovie.release_date)}</span>
                    )}
                    
                    {currentMovie.runtime > 0 && (
                      <span>{formatRuntime(currentMovie.runtime)}</span>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      {currentMovie.genres?.map(genre => (
                        <span key={genre.id} className="px-2 py-1 bg-secondary rounded-md">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Rating and actions */}
                  <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
                    {currentMovie.vote_average > 0 && (
                      <div className="bg-accent rounded-full w-12 h-12 flex items-center justify-center">
                        <span className="text-white font-bold">
                          {Math.round(currentMovie.vote_average * 10)}%
                        </span>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      {hasTrailer && (
                        <button
                          onClick={handleTrailerPlay}
                          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                          <span>Play Trailer</span>
                        </button>
                      )}
                      
                      <button 
                        onClick={handleStreamMovie}
                        className="flex items-center space-x-2 bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-full transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>{isStreaming ? 'Now Playing...' : 'Watch Movie'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content area with tabs */}
      <div className="container mx-auto px-4 mt-24 md:mt-16">
        {/* Navigation tabs */}
        <div className="flex border-b border-gray-700 mb-6 overflow-x-auto hide-scrollbar">
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === 'overview' ? 'text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === 'cast' ? 'text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('cast')}
          >
            Cast & Crew
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === 'similar' ? 'text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('similar')}
          >
            Recommended
          </button>
        </div>
        
        {/* Tab content */}
        <div className="mb-16">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                {/* Tagline */}
                {currentMovie.tagline && (
                  <p className="text-gray-400 italic text-lg mb-4">"{currentMovie.tagline}"</p>
                )}
                
                {/* Overview */}
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-white mb-3">Synopsis</h2>
                  <p className="text-gray-300">{currentMovie.overview || 'No overview available.'}</p>
                </div>
                
                {/* Director */}
                {director && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white">Director</h3>
                    <p className="text-gray-300">{director.name}</p>
                  </div>
                )}
              </div>
              
              {/* Movie details sidebar */}
              <div className="md:col-span-1 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Status</h3>
                  <p className="text-gray-300">{currentMovie.status}</p>
                </div>
                
                {currentMovie.budget > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white">Budget</h3>
                    <p className="text-gray-300">${formatNumber(currentMovie.budget)}</p>
                  </div>
                )}
                
                {currentMovie.revenue > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white">Revenue</h3>
                    <p className="text-gray-300">${formatNumber(currentMovie.revenue)}</p>
                  </div>
                )}
                
                {currentMovie.production_companies?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white">Production</h3>
                    <div className="text-gray-300">
                      {currentMovie.production_companies.map((company, index) => (
                        <span key={company.id}>
                          {company.name}
                          {index < currentMovie.production_companies.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'cast' && (
            <>
              <h2 className="text-2xl font-semibold text-white mb-6">Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {topCast.map(person => (
                  <div key={person.id} className="bg-secondary rounded-lg overflow-hidden shadow-md">
                    <div className="aspect-[2/3]">
                      <img 
                        src={getImageUrl(person.profile_path, 'w300')} 
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-white font-medium truncate">{person.name}</p>
                      <p className="text-gray-400 text-sm truncate">{person.character}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {currentMovie.credits?.crew && currentMovie.credits.crew.length > 0 && (
                <>
                  <h2 className="text-2xl font-semibold text-white mt-12 mb-6">Featured Crew</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {currentMovie.credits.crew.filter(person => 
                      ['Director', 'Producer', 'Screenplay', 'Writer'].includes(person.job)
                    ).slice(0, 8).map(person => (
                      <div key={`${person.id}-${person.job}`} className="bg-secondary rounded-lg overflow-hidden shadow-md p-3">
                        <p className="text-white font-medium">{person.name}</p>
                        <p className="text-gray-400 text-sm">{person.job}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
          
          {activeTab === 'similar' && (
            <>
              {currentMovie.recommendations?.results && currentMovie.recommendations.results.length > 0 ? (
                <>
                  <h2 className="text-2xl font-semibold text-white mb-6">Recommended Movies</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {currentMovie.recommendations.results.slice(0, 10).map(movie => (
                      <MediaCard key={movie.id} item={movie} mediaType="movie" />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-white mb-6">Similar Movies</h2>
                  {currentMovie.similar?.results && currentMovie.similar.results.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {currentMovie.similar.results.slice(0, 10).map(movie => (
                        <MediaCard key={movie.id} item={movie} mediaType="movie" />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No similar movies found.</p>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MovieDetailPage;
