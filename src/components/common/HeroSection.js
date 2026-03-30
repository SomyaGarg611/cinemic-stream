import React from 'react';

const HeroSection = ({ title, subtitle, imageUrl, children }) => {
  return (
    <div 
      className="relative bg-cover bg-center py-8 md:py-16"
      style={{ 
        backgroundImage: imageUrl ? `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url(${imageUrl})` : 'none',
        backgroundColor: imageUrl ? 'transparent' : '#111827'
      }}
    >
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{title}</h1>
        {subtitle && <p className="text-xl text-gray-300 mb-6">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
};

export default HeroSection;
