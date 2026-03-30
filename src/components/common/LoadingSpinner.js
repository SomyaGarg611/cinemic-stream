import React from 'react';

const LoadingSpinner = ({ size = 'medium' }) => {
  let sizeClasses;
  
  switch (size) {
    case 'small':
      sizeClasses = 'w-5 h-5 border-2';
      break;
    case 'large':
      sizeClasses = 'w-12 h-12 border-4';
      break;
    default: // medium
      sizeClasses = 'w-8 h-8 border-3';
  }

  return (
    <div className="flex items-center justify-center my-8">
      <div className={`${sizeClasses} border-t-accent border-r-accent border-b-transparent border-l-transparent rounded-full animate-spin`}></div>
    </div>
  );
};

export default LoadingSpinner;
