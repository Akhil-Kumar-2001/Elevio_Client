import React from 'react';

const CartLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4">
          <svg 
            viewBox="0 0 100 100" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full animate-pulse"
          >
            {/* Simple Cart Icon */}
            <path 
              d="M30,30 L20,10 L10,10" 
              className="fill-none stroke-gray-800 stroke-2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path 
              d="M10,10 L20,50 L70,50 L80,20 L30,20" 
              className="fill-none stroke-gray-800 stroke-2"
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            
            {/* Wheels */}
            <circle cx="30" cy="65" r="5" className="fill-gray-800" />
            <circle cx="60" cy="65" r="5" className="fill-gray-800" />
            
            {/* Loading indicator */}
            <path 
              d="M40,35 L60,35" 
              className="fill-none stroke-gray-800 stroke-2 animate-spin origin-center"
              strokeLinecap="round"
              style={{transformBox: 'fill-box', transformOrigin: 'center'}}
            />
          </svg>
        </div>
        <p className="text-gray-600 font-medium">Loading cart...</p>
      </div>
    </div>
  );
};

export default CartLoading;