import Navbar from '@/components/student/navbar';
import React from 'react';

const WishlistPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Navbar />
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 animate-fade-in">
          Wishlist Coming Soon!
        </h1>
        <p className="text-gray-600 mb-6">
          {`We're working hard to bring you an amazing wishlist experience. 
          Stay tuned for something special!`}
        </p>
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Thank you for your patience!
        </p>
      </div>
    </div>
  );
};

export default WishlistPage;