// src/components/student/subscriptionBanner.jsx

import React from 'react';

const SubscriptionBanner = () => {
  return (
    <div className="w-full my-6 px-16 pt-6">
      <div className="flex items-center justify-between bg-gray-900 text-white py-8 px-6 rounded-lg shadow-md">
        {/* Left Side: Text */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">Subscribe now</h3>
          <p className="text-sm text-gray-300">
            to unlock all features and enhance your learning experience
          </p>
        </div>

        {/* Right Side: Button */}
        <button className="bg-white text-gray-900 font-medium py-2 px-4 rounded-full hover:bg-gray-200 transition duration-300">
          Subscribe Now
        </button>
      </div>
    </div>
  );
};

export default SubscriptionBanner;