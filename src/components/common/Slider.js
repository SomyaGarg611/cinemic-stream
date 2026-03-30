import React, { useRef } from 'react';

const Slider = ({ title, children }) => {
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: sliderRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="my-8">
      {title && (
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">{title}</h2>
      )}
      
      <div className="relative group">
        {/* Left scroll button */}
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none"
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* The slider */}
        <div 
          ref={sliderRef}
          className="flex overflow-x-auto space-x-2 md:space-x-3 py-2 hide-scrollbar"
          style={{ scrollbarWidth: 'none' }}
        >
          {children}
        </div>
        
        {/* Right scroll button */}
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none"
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Slider;
