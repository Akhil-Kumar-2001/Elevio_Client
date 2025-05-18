import React from 'react';

const WishlistLoading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4">
          <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full animate-pulse"
          >
            {/* Heart-shaped Wishlist Icon */}
            <path
              d="M50 30 C40 10, 20 10, 20 30 C20 50, 50 70, 50 70 C50 70, 80 50, 80 30 C80 10, 60 10, 50 30"
              className="fill-none stroke-purple-600 stroke-2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Sparkle/Loading Indicator */}
            <path
              d="M45 35 L55 35"
              className="fill-none stroke-indigo-600 stroke-2 animate-spin origin-center"
              strokeLinecap="round"
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            />
            <path
              d="M45 40 L55 40"
              className="fill-none stroke-indigo-600 stroke-2 animate-spin origin-center"
              strokeLinecap="round"
              style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDirection: 'reverse' }}
            />
          </svg>
        </div>
        <p className="text-gray-600 font-medium">Loading wishlist...</p>
      </div>
    </div>
  );
};

export default WishlistLoading;