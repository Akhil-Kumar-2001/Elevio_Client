import React from 'react';
import Navbar from '@/components/tutor/header';

const VerificationProgress = () => {
  return (
    <div className="flex justify-center items-center w-full p-4 bg-white min-h-screen">
      <Navbar />
      <div className="bg-white rounded-md p-8 max-w-md w-full flex flex-col items-center border border-gray-200 shadow-lg">
        {/* Clock Icon */}
        <div className="mb-4 p-6 rounded-full bg-blue-100">
          <div className="text-blue-600 w-6 h-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4 text-black">Verification in Progress</h2>

        {/* Description */}
        <p className="text-center text-blue-600 mb-6">
          Thank you for submitting your tutor verification form.
          <br />
          Our team is currently reviewing your application.
        </p>

        {/* Progress Bar */}
        <div className="w-full mb-6 flex items-center">
          <div className="bg-green-100 p-1 rounded-full">
            <svg className="text-green-500 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div className="h-1 flex-grow bg-green-500 rounded mx-1"></div>
          <div className="text-xs text-green-500">
            Form<br />submitted
          </div>
        </div>

        {/* Estimated Time */}
        <div className="text-center mb-4">
          <span className="text-blue-600">Estimated review time: </span>
          <span className="text-blue-600 font-bold">24-48 hours</span>
        </div>

      </div>
    </div>
  );
};

export default VerificationProgress;