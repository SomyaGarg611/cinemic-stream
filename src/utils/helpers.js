// Image URL helper
export const getImageUrl = (path, size = 'original') => {
  if (!path) return 'https://via.placeholder.com/300x450?text=No+Image';
  const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';
  console.log(`Creating image URL for path: ${path}, size: ${size}, baseUrl: ${imageBaseUrl}`);
  return `${imageBaseUrl}/${size}${path}`;
};

// Format runtime to hours and minutes
export const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// Format date to readable format
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Extract YouTube trailer key
export const getTrailerKey = (videos) => {
  if (!videos || videos.length === 0) return null;
  
  // First try to find official trailers
  const trailers = videos.filter(
    video => video.type === 'Trailer' && video.site === 'YouTube' && video.official
  );
  
  // If no official trailers, look for any trailer
  if (trailers.length === 0) {
    const anyTrailers = videos.filter(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
    if (anyTrailers.length > 0) return anyTrailers[0].key;
    
    // If still no trailers, just return the first video if available
    return videos[0]?.site === 'YouTube' ? videos[0].key : null;
  }
  
  return trailers[0].key;
};

// Format large numbers with commas
export const formatNumber = (num) => {
  if (!num) return 'N/A';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Filter adult content (if needed)
export const filterAdultContent = (items, allowAdult = false) => {
  if (allowAdult) return items;
  return items.filter(item => !item.adult);
};
