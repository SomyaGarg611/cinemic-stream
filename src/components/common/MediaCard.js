import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { playTrailer, fetchVideosAndPlayTrailer } from 'redux/slices/uiSlice';
import { getImageUrl, getTrailerKey } from 'utils/helpers';

const MediaCard = ({ item, mediaType }) => {
  const dispatch = useDispatch();
  
  // Debug the item properties
  console.log('MediaCard item:', item);
  
  // Determine if it's a movie, TV show, or person
  let type;
  if (item.media_type) {
    type = item.media_type; // Use the explicit media_type if available
  } else if (mediaType) {
    type = mediaType; // Use passed mediaType prop if available
  } else if (item.known_for_department) {
    type = 'person'; // If has known_for_department, it's a person
  } else if (item.profile_path) {
    type = 'person'; // If has profile_path, it's a person
  } else if (item.first_air_date) {
    type = 'tv'; // If has first_air_date, it's a TV show
  } else {
    type = 'movie'; // Default to movie
  }
  
  console.log('Detected type:', type);
  console.log('Has profile_path:', Boolean(item.profile_path));
  console.log('Has poster_path:', Boolean(item.poster_path));
  
  const title = type === 'movie' ? item.title : item.name;
  const releaseDate = type === 'movie' ? item.release_date : item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const detailPath = `/${type}/${item.id}`;

  // Handle trailer play
  const handlePlayTrailer = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event from bubbling up to parent Link
    
    console.log('[MediaCard] Play Trailer button clicked');
    console.log('[MediaCard] Item ID:', item.id, 'Type:', type);
    
    // Direct approach - always fetch videos to ensure we have the latest
    console.log('[MediaCard] Fetching videos for item:', item.id);
    dispatch(fetchVideosAndPlayTrailer({ 
      id: item.id, 
      mediaType: type === 'multi' ? (item.media_type || 'movie') : type
    }))
    .then((result) => {
      console.log('[MediaCard] fetchVideosAndPlayTrailer result:', result);
    })
    .catch((error) => {
      console.error('[MediaCard] Failed to fetch videos:', error);
    });
  };

  return (
    <div className="relative group rounded overflow-hidden bg-secondary shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link to={detailPath}>
        <div className="relative aspect-[3/4]">
          {console.log('Image render - type:', type, 'media_type:', item.media_type, 'profile_path:', item.profile_path, 'poster_path:', item.poster_path)}
          <img 
            src={type === 'person' 
              ? getImageUrl(item.profile_path, 'w500') 
              : getImageUrl(item.poster_path, 'w500')
            }
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Hover overlay with action buttons */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Show play button for movies and TV shows */}
            {!type.includes('person') ? (
              <div onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={handlePlayTrailer}
                  className="bg-accent bg-opacity-80 rounded-full p-1.5 md:p-2 hover:bg-opacity-100 transition-all duration-300"
                  aria-label="Play trailer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            ) : null}
          </div>
        </div>
        
        {/* Rating badge */}
        {type !== 'person' && item.vote_average > 0 && (
          <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-black bg-opacity-70 text-accent font-semibold text-xs md:text-sm rounded-md px-1 py-0.5 md:px-2 md:py-1">
            {Math.round(item.vote_average * 10) / 10}
          </div>
        )}

        <div className="p-1 md:p-2">
          <h3 className="text-white font-medium truncate text-xs leading-tight">{title}</h3>
          <div className="flex items-center justify-between">
            {type === 'person' ? (
              <span className="text-gray-400 text-xs truncate">
                {item.known_for_department || 'Actor'}
              </span>
            ) : (
              <span className="text-gray-400 text-xs">
                {year || 'Unknown'}
              </span>
            )}
            <span className="text-gray-400 text-xs capitalize ml-1">
              {type}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MediaCard;
