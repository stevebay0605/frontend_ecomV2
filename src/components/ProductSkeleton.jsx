import React from 'react';

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="relative overflow-hidden bg-gray-200" style={{height: '280px'}}>
        <div className="w-full h-full flex items-center justify-center">
          <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <div className="p-4">
        {/* Title Skeleton */}
        <div className="mb-2">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Description Skeleton */}
        <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>

        {/* Color Variants Skeleton */}
        <div className="mb-3">
          <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
          </div>
        </div>

        {/* Price Skeleton */}
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>

        {/* Button Skeleton */}
        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
      </div>
    </div>
  );
}

export default ProductSkeleton;
