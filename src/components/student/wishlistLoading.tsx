import React from 'react';

const WishlistLoading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-32 h-32 mx-auto mb-6">
          <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Book outline */}
            <rect
              x="20"
              y="20"
              width="60"
              height="60"
              rx="5"
              className="fill-none stroke-indigo-600 stroke-2"
            />
            {/* Spine */}
            <line
              x1="50"
              y1="20"
              x2="50"
              y2="80"
              className="stroke-purple-600 stroke-2"
            />
            {/* Flipping page effect */}
            <rect
              x="50"
              y="30"
              width="25"
              height="40"
              rx="3"
              className="fill-none stroke-indigo-600 stroke-2 animate-[flip_1.5s_ease-in-out_infinite]"
              style={{ transformOrigin: 'left center' }}
            />
          </svg>
          <style>
            {`
              @keyframes flip {
                0% { transform: rotateY(0deg); }
                50% { transform: rotateY(90deg); }
                100% { transform: rotateY(0deg); }
              }
            `}
          </style>
        </div>
        <p className="text-gray-600 font-medium text-lg">Fetching your wishlist...</p>
      </div>
    </div>
  );
};

export default WishlistLoading;