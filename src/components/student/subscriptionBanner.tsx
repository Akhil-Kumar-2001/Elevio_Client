import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const SubscriptionBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  console.log(isVisible)
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="w-full my-6 px-4 sm:px-16 pt-6">
      <div className="relative flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-8 px-6 sm:px-8 rounded-2xl shadow-xl overflow-hidden animate-gradient">
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-gradient-bg" style={{ animation: 'gradientShift 15s ease infinite' }}></div>
        
        {/* Left Side: Text */}
        <div className="relative z-10 flex flex-col mb-6 sm:mb-0">
          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Unlock Premium Learning
          </h3>
          <p className="text-sm sm:text-base text-gray-200 mt-2 max-w-md">
            Subscribe now to access all features, exclusive content, and elevate your learning experience.
          </p>
        </div>

        {/* Right Side: Button */}
        <Link 
          href={`/subscription`} 
          className="relative z-10 group bg-white text-gray-900 font-semibold py-3 px-6 rounded-full shadow-lg border border-white/20 hover:shadow-2xl hover:scale-110 transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10">Subscribe Now</span>
          <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/50 to-orange-500/50 w-0 group-hover:w-full transition-all duration-500 ease-out"></span>
        </Link>

        {/* CSS for Gradient Animation */}
        <style jsx>{`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-bg {
            background-size: 200% 200%;
          }
        `}</style>
      </div>
    </div>
  );
};

export default SubscriptionBanner;