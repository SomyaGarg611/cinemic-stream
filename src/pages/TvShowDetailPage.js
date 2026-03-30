import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTvShowDetails, fetchTvShowSeason } from 'redux/slices/tvShowsSlice';
import { playTrailer } from 'redux/slices/uiSlice';
import { getImageUrl, formatDate, getTrailerKey } from 'utils/helpers';
import LoadingSpinner from 'components/common/LoadingSpinner';
import MediaCard from 'components/common/MediaCard';
import StreamingModal from 'components/common/StreamingModal';

const TvShowDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentShow, seasons, status, error } = useSelector((state) => state.tvShows);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [isStreaming, setIsStreaming] = useState(false);
  const [loadingEpisode, setLoadingEpisode] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      dispatch(fetchTvShowDetails(id));
    }
  }, [dispatch, id]);

  // Fetch selected season data when needed
  useEffect(() => {
    if (currentShow && selectedSeason) {
      // Check if we already have this season data
      const showId = currentShow.id;
      if (!seasons[showId] || !seasons[showId][selectedSeason]) {
        dispatch(fetchTvShowSeason({ id: showId, seasonNumber: selectedSeason }));
      }
    }
  }, [dispatch, currentShow, selectedSeason, seasons]);

  const handleTrailerPlay = () => {
    if (currentShow?.videos?.results) {
      const trailerKey = getTrailerKey(currentShow.videos.results);
      if (trailerKey) {
        dispatch(playTrailer(trailerKey));
      }
    }
  };

  const handleWatchSeries = () => {
    console.log('Watch series button clicked for:', currentShow.name);
    setIsStreaming(true);
  };
  
  const handleCloseStreamingModal = () => {
    console.log('Closing streaming modal');
    setIsStreaming(false);
  };

  if (status === 'loading' && !currentShow) {
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
          <h2 className="text-xl text-white mb-2">Error Loading TV Show</h2>
          <p className="text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  if (!currentShow) return null;

  const hasTrailer = currentShow.videos?.results && getTrailerKey(currentShow.videos.results);
  
  // Get creator and top cast
  const creators = currentShow.created_by || [];
  const topCast = currentShow.credits?.cast?.slice(0, 10) || [];
  
  // Get current season data
  const currentSeasonData = currentShow.id && seasons[currentShow.id] && seasons[currentShow.id][selectedSeason];
  const isLoadingSeasons = status === 'loading' && activeTab === 'episodes';

  return (
    <>
      {/* Streaming Modal */}
      <StreamingModal 
        isOpen={isStreaming} 
        onClose={handleCloseStreamingModal} 
        movie={currentShow}
        mediaType="tv"
      />
      {/* TV Show Banner */}
      <div className="relative">
        <div className="w-full h-[40vh] md:h-[60vh] bg-secondary">
          {currentShow.backdrop_path && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${getImageUrl(currentShow.backdrop_path, 'original')})`
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
          
          {/* Content container */}
          <div className="absolute bottom-0 w-full">
            <div className="container mx-auto px-4 pb-8">
              <div className="flex flex-col md:flex-row items-center md:items-end space-y-8 md:space-y-0 md:space-x-8">
                {/* TV Show poster */}
                <div className="w-48 md:w-64 flex-shrink-0 relative -mb-20 md:-mb-16">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
                    <img 
                      src={getImageUrl(currentShow.poster_path, 'w500')} 
                      alt={currentShow.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {/* TV Show info */}
                <div className="flex-grow text-center md:text-left pb-4">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                    {currentShow.name}
                    {currentShow.first_air_date && (
                      <span className="text-gray-300 text-lg ml-2">
                        ({new Date(currentShow.first_air_date).getFullYear()})
                      </span>
                    )}
                  </h1>
                  
                  {/* TV Show metadata */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-1 mt-3 text-sm text-gray-300">
                    {currentShow.first_air_date && (
                      <span>First aired {formatDate(currentShow.first_air_date)}</span>
                    )}
                    
                    {currentShow.number_of_seasons > 0 && (
                      <span>
                        {currentShow.number_of_seasons} {currentShow.number_of_seasons === 1 ? 'Season' : 'Seasons'}
                      </span>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      {currentShow.genres?.map(genre => (
                        <span key={genre.id} className="px-2 py-1 bg-secondary rounded-md">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Rating and actions */}
                  <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
                    {currentShow.vote_average > 0 && (
                      <div className="bg-accent rounded-full w-12 h-12 flex items-center justify-center">
                        <span className="text-white font-bold">
                          {Math.round(currentShow.vote_average * 10)}%
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
                        onClick={handleWatchSeries}
                        className="flex items-center space-x-2 bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-full transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>{isStreaming ? 'Now Playing...' : 'Watch Series'}</span>
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
              activeTab === 'episodes' ? 'text-accent border-b-2 border-accent' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('episodes')}
          >
            Episodes
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
                {currentShow.tagline && (
                  <p className="text-gray-400 italic text-lg mb-4">"{currentShow.tagline}"</p>
                )}
                
                {/* Overview */}
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-white mb-3">Synopsis</h2>
                  <p className="text-gray-300">{currentShow.overview || 'No overview available.'}</p>
                </div>
                
                {/* Creators */}
                {creators.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white">
                      {creators.length === 1 ? 'Creator' : 'Creators'}
                    </h3>
                    <p className="text-gray-300">
                      {creators.map((creator, index) => (
                        <span key={creator.id}>
                          {creator.name}
                          {index < creators.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </p>
                  </div>
                )}
              </div>
              
              {/* TV Show details sidebar */}
              <div className="md:col-span-1 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Status</h3>
                  <p className="text-gray-300">{currentShow.status}</p>
                </div>
                
                {currentShow.type && (
                  <div>
                    <h3 className="text-lg font-semibold text-white">Type</h3>
                    <p className="text-gray-300">{currentShow.type}</p>
                  </div>
                )}
                
                {currentShow.networks?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white">Network</h3>
                    <div className="text-gray-300">
                      {currentShow.networks.map((network, index) => (
                        <span key={network.id}>
                          {network.name}
                          {index < currentShow.networks.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {currentShow.production_companies?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white">Production</h3>
                    <div className="text-gray-300">
                      {currentShow.production_companies.map((company, index) => (
                        <span key={company.id}>
                          {company.name}
                          {index < currentShow.production_companies.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'episodes' && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-white mb-3">Episodes</h2>
                
                {/* Season selector */}
                <div className="mb-6">
                  <label htmlFor="season-select" className="block text-gray-300 mb-2">
                    Select Season:
                  </label>
                  <select
                    id="season-select"
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(Number(e.target.value))}
                    className="bg-secondary text-white py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {currentShow.seasons?.filter(season => season.season_number > 0).map(season => (
                      <option key={season.id} value={season.season_number}>
                        Season {season.season_number}
                      </option>
                    ))}
                  </select>
                </div>
                
                {isLoadingSeasons ? (
                  <LoadingSpinner size="medium" />
                ) : currentSeasonData ? (
                  <div className="space-y-4">
                    {currentSeasonData.episodes?.map(episode => (
                      <div key={episode.id} className="bg-secondary rounded-lg overflow-hidden shadow-md">
                        <div className="flex flex-col md:flex-row">
                          {episode.still_path && (
                            <div className="md:w-64 flex-shrink-0">
                              <img 
                                src={getImageUrl(episode.still_path, 'w300')} 
                                alt={`${episode.name} still`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <h3 className="text-white font-semibold text-lg">
                                {episode.episode_number}. {episode.name}
                              </h3>
                              {episode.vote_average > 0 && (
                                <span className="bg-accent bg-opacity-20 text-accent px-2 py-1 rounded-md text-sm">
                                  {Math.round(episode.vote_average * 10) / 10}
                                </span>
                              )}
                            </div>
                            
                            {episode.air_date && (
                              <p className="text-gray-400 text-sm mt-1">
                                {formatDate(episode.air_date)}
                              </p>
                            )}
                            
                            <p className="text-gray-300 mt-3 line-clamp-3">
                              {episode.overview || 'No overview available.'}
                            </p>
                            
                            <button 
                              onClick={() => {
                                // Set loading state for this episode
                                setLoadingEpisode(episode.id);
                                
                                // Show the streaming modal - the StreamingModal component will handle URL creation
                                setIsStreaming(true);
                                
                                // Create an event to communicate with the StreamingModal
                                const event = new CustomEvent('loadTvEpisode', { 
                                  detail: { 
                                    showId: currentShow.id,
                                    season: selectedSeason,
                                    episode: episode.episode_number,
                                    episodeData: episode
                                  } 
                                });
                                document.dispatchEvent(event);
                                
                                // Reset loading state after a moment
                                setTimeout(() => setLoadingEpisode(null), 1500);
                              }}
                              className={`mt-3 ${loadingEpisode === episode.id ? 'text-gray-400' : 'text-accent hover:text-accent-dark'} transition-colors text-sm flex items-center relative group`}
                              disabled={loadingEpisode === episode.id}
                              aria-label={`Watch Season ${selectedSeason}, Episode ${episode.episode_number}`}
                              title={`Watch this episode`}
                            >
                              {loadingEpisode === episode.id ? (
                                <svg className="animate-spin h-4 w-4 mr-1 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                              )}
                              <span>{loadingEpisode === episode.id ? 'Loading...' : 'Watch Episode'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No episode information available for this season.</p>
                )}
              </div>
            </>
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
              
              {currentShow.credits?.crew && currentShow.credits.crew.length > 0 && (
                <>
                  <h2 className="text-2xl font-semibold text-white mt-12 mb-6">Featured Crew</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {currentShow.credits.crew.filter(person => 
                      ['Director', 'Producer', 'Executive Producer', 'Writer'].includes(person.job)
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
              {currentShow.recommendations?.results && currentShow.recommendations.results.length > 0 ? (
                <>
                  <h2 className="text-2xl font-semibold text-white mb-6">Recommended Shows</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {currentShow.recommendations.results.slice(0, 10).map(show => (
                      <MediaCard key={show.id} item={show} mediaType="tv" />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-white mb-6">Similar Shows</h2>
                  {currentShow.similar?.results && currentShow.similar.results.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {currentShow.similar.results.slice(0, 10).map(show => (
                        <MediaCard key={show.id} item={show} mediaType="tv" />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No similar shows found.</p>
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

export default TvShowDetailPage;
