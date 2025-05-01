import React from 'react';
import { BookX, ArrowLeft } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <BookX className="w-24 h-24 text-black" />
            <div className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 py-1 rounded-full">
              404
            </div>
          </div>
        </div>

        {/* Main Content */}
        <h1 className="text-6xl font-bold text-black mb-4">Page Not Found</h1>
        <p className="text-gray-600 text-xl mb-8">
          {"Oops! The learning resource you're looking for seems to have wandered off."}
        </p>

        {/* Divider */}
        <div className="w-16 h-1 bg-black mx-auto mb-8"></div>

        {/* Suggestions */}
        <div className="mb-12 text-gray-500">
          <p className="mb-2">You might want to:</p>
          <ul className="space-y-2">
            <li>• Check the URL for any typos</li>
            <li>• Return to your previous lesson</li>
            <li>• Browse our course catalog</li>
          </ul>
        </div>

        {/* Back Button */}
        <a 
          href="/home"
          className="inline-flex items-center px-6 py-3 border-2 border-black text-black hover:bg-black hover:text-white transition-colors duration-300 font-medium rounded-lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Homepage
        </a>
      </div>
    </div>
  );
}

export default App;