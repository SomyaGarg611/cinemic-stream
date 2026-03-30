import React, { useEffect, useRef, useState } from 'react';
// Remove unused ReactPlayer import
// import ReactPlayer from 'react-player';

const StreamingModal = ({ isOpen, onClose, movie, mediaType = 'movie' }) => {
  const modalRef = useRef();
  const iframeRef = useRef();
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [streamUrl, setStreamUrl] = useState('');
  const [totalSeasons, setTotalSeasons] = useState(1);
  const [episodesPerSeason, setEpisodesPerSeason] = useState(10); // Default assumption
  const [episodeTitle, setEpisodeTitle] = useState('');
  const [selectedServer, setSelectedServer] = useState(3); // Default to server 3 
  const [currentContent, setCurrentContent] = useState(movie); // Store current movie or TV show data
  
  // Define server options
  const movieServers = [
    { id: 1, name: 'Server 1', url: process.env.REACT_APP_MOVIE_SERVER1  },
    { id: 2, name: 'Server 2', url: process.env.REACT_APP_MOVIE_SERVER2  },
    { id: 3, name: 'Server 3', url: process.env.REACT_APP_MOVIE_SERVER3  },
    { id: 4, name: 'Server 4', url: process.env.REACT_APP_MOVIE_SERVER4  },
    { id: 5, name: 'Server 5', url: process.env.REACT_APP_MOVIE_SERVER5  },
    { id: 6, name: 'Server 6', url: process.env.REACT_APP_MOVIE_SERVER6  },
    { id: 7, name: 'Server 7', url: process.env.REACT_APP_MOVIE_SERVER7  },
    { id: 8, name: 'Server 8', url: process.env.REACT_APP_MOVIE_SERVER8  },
    { id: 9, name: 'Server 9', url: process.env.REACT_APP_MOVIE_SERVER9  },
    { id: 10, name: 'Server 10', url: process.env.REACT_APP_MOVIE_SERVER10  }
  ];
  
  const tvServers = [
    { id: 1, name: 'Server 1', url: process.env.REACT_APP_TV_SERVER1  },
    { id: 2, name: 'Server 2', url: process.env.REACT_APP_TV_SERVER2  },
    { id: 3, name: 'Server 3', url: process.env.REACT_APP_TV_SERVER3  },
    { id: 4, name: 'Server 4', url: process.env.REACT_APP_TV_SERVER4  },
    { id: 5, name: 'Server 5', url: process.env.REACT_APP_TV_SERVER5  },
    { id: 6, name: 'Server 6', url: process.env.REACT_APP_TV_SERVER6  },
    { id: 7, name: 'Server 7', url: process.env.REACT_APP_TV_SERVER7  },
    { id: 8, name: 'Server 8', url: process.env.REACT_APP_TV_SERVER8  },
    { id: 9, name: 'Server 9', url: process.env.REACT_APP_TV_SERVER9  },
    { id: 10, name: 'Server 10', url: process.env.REACT_APP_TV_SERVER10  }
  ];

  // Function to generate URL based on server and content
  const generateStreamUrl = (serverId, contentId, season = null, episode = null) => {
    const servers = mediaType === 'movie' ? movieServers : tvServers;
    const server = servers.find(s => s.id === serverId) || servers.find(s => s.id === 3); 
    
    if (mediaType === 'movie') {
      // Handle special URL formats for certain servers
      if (serverId === 10) { // uembed.xyz uses query parameter
        return `${server.url}${contentId}`;
      }
      return server.url + contentId;
    } else {
      // Handle different server URL formats for TV shows
      if (serverId === 4) { 
        return `${server.url}/${contentId}/${season}/${episode}`;
      } else if (serverId === 5) { // MultiEmbed
        return `${server.url}${contentId}&s=${season}&e=${episode}`;
      } else if (serverId === 10) { // uembed.xyz uses query parameter for TV too
        return `${server.url}${contentId}&s=${season}&e=${episode}`;
      } else {
        return `${server.url}${contentId}/${season}/${episode}`;
      }
    }
  };

  useEffect(() => {
    // Listen for custom events to load specific TV episodes
    const handleLoadTvEpisode = (event) => {
      const { showId, season, episode, episodeData } = event.detail;
      console.log('Received loadTvEpisode event:', event.detail);
      
      setSelectedSeason(season);
      setSelectedEpisode(episode);
      
      if (episodeData && episodeData.name) {
        setEpisodeTitle(episodeData.name);
      }
      
      // Generate the stream URL for this episode using the selected server
      const episodeUrl = generateStreamUrl(selectedServer, showId, season, episode);
      setStreamUrl(episodeUrl);
    };
    
    // Listen for custom events to load movies
    const handleLoadMovie = (event) => {
      const { movieData } = event.detail;
      console.log('Received loadMovie event:', event.detail);
      
      // Set movie data
      if (!currentContent || currentContent.id !== movieData.id) {
        setCurrentContent(movieData);
      }
      
      // Generate the stream URL for this movie using the selected server
      const movieUrl = generateStreamUrl(selectedServer, movieData.id);
      setStreamUrl(movieUrl);
    };
    
    document.addEventListener('loadMovie', handleLoadMovie);
    document.addEventListener('loadTvEpisode', handleLoadTvEpisode);
    
    return () => {
      document.removeEventListener('loadMovie', handleLoadMovie);
      document.removeEventListener('loadTvEpisode', handleLoadTvEpisode);
    };
  }, [selectedServer, generateStreamUrl, currentContent]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
      setIsLoading(true);
      
      // Initialize streaming URL based on media type and selected server
      if (mediaType === 'movie') {
        console.log('Setting up movie URL with server', selectedServer);
        const movieUrl = generateStreamUrl(selectedServer, movie.id);
        console.log('Generated movie URL:', movieUrl);
        setStreamUrl(movieUrl);
      } else {
        console.log('Setting up TV show URL with server', selectedServer);
        // For TV shows, use current season and episode
        const tvUrl = generateStreamUrl(selectedServer, movie.id, selectedSeason, selectedEpisode);
        console.log('Initial TV URL:', tvUrl);
        setStreamUrl(tvUrl);
        
        // Set total seasons if available from the API
        if (movie.number_of_seasons) {
          console.log('Number of seasons from API:', movie.number_of_seasons);
          setTotalSeasons(movie.number_of_seasons);
        }

        // Set episodes per season if available
        if (movie.seasons && movie.seasons.length > 0) {
          const currentSeason = movie.seasons.find(s => s.season_number === selectedSeason);
          if (currentSeason && currentSeason.episode_count) {
            console.log('Episodes in selected season:', currentSeason.episode_count);
            setEpisodesPerSeason(currentSeason.episode_count);
          }
        }
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      // Allow scrolling when modal is closed
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, movie, mediaType, selectedSeason, selectedEpisode]);
  
  // Keep currentContent in sync with movie prop
  useEffect(() => {
    if (movie) {
      setCurrentContent(movie);
    }
  }, [movie]);

  const updateTvStreamUrl = () => {
    const content = movie || currentContent;
    console.log('Update TV Stream URL called');
    console.log('Current content:', content);
    console.log('Selected season:', selectedSeason);
    console.log('Selected episode:', selectedEpisode);
    console.log('Selected server:', selectedServer);
    
    setIsLoading(true);
    
    // Make sure we have content to generate URL
    if (content?.id) {
      // Generate the URL based on selected server
      const newUrl = generateStreamUrl(selectedServer, content.id, selectedSeason, selectedEpisode);
      console.log('Setting new stream URL:', newUrl);
      
      // Update the stream URL state
      setStreamUrl(newUrl);
    } else {
      console.warn('No content available to generate stream URL');
    }
    
    // Hide loading indicator after a brief moment
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  
  // Check for scrollability when the modal is opened or resized
  useEffect(() => {
    if (isOpen) {
      const checkScrollability = () => {
        const serverContainers = document.querySelectorAll('.scrollable-container');
        serverContainers.forEach(container => {
          if (container.scrollHeight > container.clientHeight) {
            container.classList.add('is-scrollable');
          } else {
            container.classList.remove('is-scrollable');
          }
        });
      };
      
      // Check on load and window resize
      checkScrollability();
      window.addEventListener('resize', checkScrollability);
      
      return () => {
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [isOpen]);

  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl my-2 sm:my-4" ref={modalRef}>
        <div className="bg-secondary rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <div>
              <h2 className="text-xl font-semibold text-white">{movie.title || movie.name}</h2>
              <p className="text-sm text-accent">
                {mediaType === 'tv' && episodeTitle ? 
                  `Season ${selectedSeason}, Episode ${selectedEpisode}: ${episodeTitle}` : 
                  `Streaming from Server ${selectedServer}`
                }
                <span className="ml-2 px-2 py-0.5 bg-accent bg-opacity-20 rounded-full text-xs">
                  {(mediaType === 'movie' ? movieServers : tvServers).find(s => s.id === selectedServer)?.name || `Server ${selectedServer}`}
                </span>
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* TV Show Season & Episode Selector */}
          {mediaType === 'tv' && (
            <div className="bg-gray-800 p-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center">
                <label htmlFor="season" className="text-white mr-2">Season:</label>
                <select 
                  id="season" 
                  value={selectedSeason}
                  onChange={(e) => {
                    const newSeason = Number(e.target.value);
                    console.log('Season changed to:', newSeason);
                    setSelectedSeason(newSeason);
                    setSelectedEpisode(1); // Reset episode when season changes
                    
                    // Update episodes for this season if available
                    if (movie.seasons) {
                      const seasonInfo = movie.seasons.find(s => s.season_number === newSeason);
                      if (seasonInfo && seasonInfo.episode_count) {
                        console.log('Setting episodes for season to:', seasonInfo.episode_count);
                        setEpisodesPerSeason(seasonInfo.episode_count);
                      } else {
                        // Fallback to default
                        setEpisodesPerSeason(10);
                      }
                    }
                    
                    // Automatically update the URL when season changes
                    setTimeout(() => updateTvStreamUrl(), 100);
                  }}
                  className="bg-gray-700 text-white rounded px-2 py-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {movie.seasons && movie.seasons.length > 0
                    ? movie.seasons
                        .filter(season => season.season_number > 0) // Skip specials (season 0)
                        .map(season => (
                          <option key={season.id || season.season_number} value={season.season_number}>
                            Season {season.season_number}{season.name ? ` - ${season.name}` : ''}
                          </option>
                        ))
                    : [...Array(totalSeasons)].map((_, i) => (
                        <option key={i+1} value={i+1}>Season {i+1}</option>
                      ))
                  }
                </select>
              </div>
              
              <div className="flex items-center">
                <label htmlFor="episode" className="text-white mr-2">Episode:</label>
                <select 
                  id="episode" 
                  value={selectedEpisode}
                  onChange={(e) => {
                    const newEpisode = Number(e.target.value);
                    console.log('Episode changed to:', newEpisode);
                    setSelectedEpisode(newEpisode);
                    
                    // Automatically update the URL when episode changes
                    setTimeout(() => updateTvStreamUrl(), 100);
                  }}
                  className="bg-gray-700 text-white rounded px-2 py-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {[...Array(episodesPerSeason)].map((_, i) => (
                    <option key={i+1} value={i+1}>Episode {i+1}</option>
                  ))}
                </select>
              </div>
              
              <button 
                className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded flex items-center"
                onClick={() => {
                  console.log('Play Episode button clicked');
                  updateTvStreamUrl();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Play Episode
              </button>
            </div>
          )}
          
          {/* Streaming Video Iframe Container */}
          <div className="relative" style={{paddingTop: '56.25%'}}> {/* 16:9 Aspect Ratio */}
            {/* Loading overlay */}
            {isLoading ? (
              <div className="absolute inset-0 z-10 bg-black bg-opacity-80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent"></div>
                <p className="text-white absolute mt-24">Loading stream...</p>
              </div>
            ) : null}
            
            {streamUrl ? (
              <iframe 
                ref={iframeRef}
                src={streamUrl}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allowFullScreen
                title={`${movie.title || movie.name} ${mediaType === 'tv' ? `- S${selectedSeason}:E${selectedEpisode} ${episodeTitle}` : ''}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                onLoad={() => {
                  console.log('Iframe loaded');
                  setIsLoading(false);
                }}
              ></iframe>
            ) : (
              <div className="absolute top-0 left-0 w-full h-full bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-4xl text-accent mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {movie.title || movie.name}
                  {mediaType === 'tv' && ` - Season ${selectedSeason}`}
                </h3>
                <p className="text-gray-300 text-lg">
                  Select season and episode to start streaming
                </p>
              </div>
            )}
          </div>
          
          {/* Server Selection */}
          <div className="p-4 border-t border-gray-700 bg-gray-800 overflow-y-auto max-h-[300px] scrollable-container" 
               style={{
                 scrollbarWidth: 'thin',
                 scrollbarColor: '#4B5563 #1F2937',
               }}>
            {/* Use movie prop first, then fallback to currentContent if received from event */}
            <div className="mb-4">
              <h3 className="text-white text-base font-medium mb-3 sticky top-0 bg-gray-800 py-2 z-10 flex items-center justify-between">
                Select Streaming Server:
                <span className="text-xs text-gray-400 flex items-center server-scroll-indicator">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Scroll for more
                </span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 overflow-y-auto pb-2">
                {(mediaType === 'movie' ? movieServers : tvServers).map((server) => (
                  <button
                    key={server.id}
                    onClick={() => {
                      setSelectedServer(server.id);
                      setIsLoading(true);
                      
                      // Generate new URL with selected server
                      const contentId = (movie || currentContent)?.id;
                      if (contentId) {
                        const newUrl = mediaType === 'movie'
                          ? generateStreamUrl(server.id, contentId)
                          : generateStreamUrl(server.id, contentId, selectedSeason, selectedEpisode);
                        
                        setStreamUrl(newUrl);
                      }
                      
                      // Hide loading after a moment
                      setTimeout(() => {
                        setIsLoading(false);
                      }, 1500);
                    }}
                    className={`px-3 py-3 text-sm font-medium rounded-lg text-center transition-colors border-2 shadow-lg ${
                      selectedServer === server.id
                        ? 'bg-accent text-white border-accent-light shadow-accent/30'
                        : 'bg-gray-700 text-white hover:bg-gray-600 border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {server.name}
                  </button>
                ))}
              </div>
              <div className="flex flex-col space-y-2 mt-2">
                <p className="text-gray-400 text-xs">If the current server doesn't work, try another one for better streaming quality or availability.</p>
                <div className="text-center text-gray-400 text-xs py-1 border border-gray-700 rounded-md bg-gray-900 bg-opacity-50">
                  <span className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    Scroll up/down to see all available servers
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="p-4 border-t border-gray-700 overflow-x-auto">
            <div className="flex flex-wrap justify-between items-center gap-2 min-w-[600px]">
              <div className="flex items-center space-x-4">
                <div className="flex space-x-3">
                  <button className="bg-accent hover:bg-accent-dark text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg shadow-accent/30 border border-accent-light whitespace-nowrap">
                    HD
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-md border border-gray-600 hover:border-gray-500 whitespace-nowrap">
                    1080p
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-md border border-gray-600 hover:border-gray-500 whitespace-nowrap">
                    720p
                  </button>
                </div>
                <div className="text-gray-400 text-sm hidden sm:block">
                  {movie.original_language?.toUpperCase()} • 
                  {mediaType === 'movie' 
                    ? ` ${movie.runtime} min` 
                    : ` ${movie.episode_run_time?.[0] || '~45'} min per episode`
                  }
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-sm">
                  Report Issue
                </button>
                <div className="text-gray-400 text-sm hidden md:block">
                  {mediaType === 'movie'
                    ? `Released: ${movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}`
                    : `First aired: ${movie.first_air_date ? new Date(movie.first_air_date).getFullYear() : 'N/A'}`
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamingModal;
