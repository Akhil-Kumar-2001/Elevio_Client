import React from 'react';

const CoursesLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4">
          <svg 
            viewBox="0 0 100 100" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full animate-pulse"
          >
            {/* Book/Course Icon */}
            <rect 
              x="20" 
              y="20" 
              width="60" 
              height="50" 
              rx="2"
              className="fill-none stroke-gray-800 stroke-2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Book pages */}
            <path 
              d="M20,30 L80,30" 
              className="fill-none stroke-gray-800 stroke-2"
              strokeLinecap="round"
            />
            
            <path 
              d="M20,40 L80,40" 
              className="fill-none stroke-gray-800 stroke-2"
              strokeLinecap="round"
            />
            
            <path 
              d="M20,50 L60,50" 
              className="fill-none stroke-gray-800 stroke-2"
              strokeLinecap="round"
            />
            
            {/* Graduation cap */}
            <path 
              d="M50,10 L30,20 L70,20 Z" 
              className="fill-gray-800 stroke-gray-800"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Loading indicator */}
            <path 
              d="M40,65 L60,65" 
              className="fill-none stroke-gray-800 stroke-2 animate-spin origin-center"
              strokeLinecap="round"
              style={{transformBox: 'fill-box', transformOrigin: 'center'}}
            />
          </svg>
        </div>
        <p className="text-gray-600 font-medium">Loading courses...</p>
      </div>
    </div>
  );
};

export default CoursesLoading;