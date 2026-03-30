import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeTrailer } from '../../redux/slices/uiSlice';

const TrailerModal = () => {
  const { isTrailerPlaying, currentTrailerKey } = useSelector(state => state.ui);
  const dispatch = useDispatch();
  const modalRef = useRef();
  
  // Enhanced debug logging
  console.log('TrailerModal render - isTrailerPlaying:', isTrailerPlaying, 'currentTrailerKey:', currentTrailerKey);
  
  // Log the YouTube URLs
  if (currentTrailerKey) {
    const watchUrl = `https://www.youtube.com/watch?v=${currentTrailerKey}`;
    const embedUrl = `https://www.youtube.com/embed/${currentTrailerKey}?autoplay=1&modestbranding=1&rel=0`;
    console.log('YouTube Watch URL:', watchUrl);
    console.log('YouTube Embed URL:', embedUrl);
  }

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isTrailerPlaying) {
        dispatch(closeTrailer());
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        dispatch(closeTrailer());
      }
    };

    if (isTrailerPlaying) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      // Allow scrolling when modal is closed
      document.body.style.overflow = 'auto';
    };
  }, [isTrailerPlaying, dispatch]);

  if (!isTrailerPlaying) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-5xl" ref={modalRef}>
        <button 
          className="absolute -top-10 right-0 text-white hover:text-accent transition-colors"
          onClick={() => dispatch(closeTrailer())}
          aria-label="Close trailer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="relative bg-black rounded-lg overflow-hidden" style={{paddingTop: '56.25%'}}> {/* 16:9 Aspect Ratio */}
          <div className="absolute top-0 left-0 w-full h-full">
            {currentTrailerKey ? (
              <>
                <iframe
                  src={`https://www.youtube.com/embed/${currentTrailerKey}?autoplay=1&modestbranding=1&rel=0`}
                  title="YouTube Trailer"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0 }}
                  onError={() => console.error("iframe failed to load")}
                ></iframe>
                <div className="absolute bottom-4 left-0 w-full text-center">
                  <a 
                    href={`https://www.youtube.com/watch?v=${currentTrailerKey}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-accent text-white py-2 px-4 rounded-md text-sm inline-block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Open in YouTube
                  </a>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-white text-lg">Loading trailer...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
