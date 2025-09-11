import React from 'react';

const EventCardSkeleton = () => {
  return (
    <div className="glass-ui transition-all duration-300 ease-in-out flex flex-col gap-4 animate-pulse">
      <div className="p-6 flex flex-col justify-around min-h-[370px]">
        <div className="relative">
          <div className="w-full h-48 bg-muted rounded-lg mb-4"></div>
          <div className="absolute top-2 left-2 glass-ui !rounded-xl !py-2 !px-4">
            <div className="w-10 h-4 bg-muted rounded"></div>
            <div className="w-6 h-4 bg-muted rounded mt-1"></div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="w-3/4 h-6 bg-muted rounded mb-2"></div>
          <div className="w-1/2 h-4 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default EventCardSkeleton;
