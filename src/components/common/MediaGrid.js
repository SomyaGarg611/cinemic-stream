import React from 'react';
import MediaCard from 'components/common/MediaCard';
import LoadingSpinner from 'components/common/LoadingSpinner';

const MediaGrid = ({ items, mediaType, loading = false, emptyMessage = 'No items found' }) => {
  if (loading) {
    return <LoadingSpinner size="large" />;
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-400 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-9 gap-1.5 md:gap-3 lg:gap-4">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} mediaType={mediaType} />
      ))}
    </div>
  );
};

export default MediaGrid;
