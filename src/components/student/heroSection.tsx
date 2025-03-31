// src/components/student/heroSection.jsx

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="flex items-center justify-between pt-32 py-10 px-16 bg-blue-50">
      {/* Left Side: Text Content */}
      <div className="flex-1 pr-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Learn from anywhere
        </h1>
        <p className="text-gray-600 mb-6">
          Gain new skills and knowledge from our expert-led courses.<br />
          Learn at your own pace, anytime and anywhere.
        </p>
        <Link href={`/courses`} className="flex items-center px-6 py-3 bg-blue-500 w-44 text-white rounded-full hover:bg-blue-600 transition">
          Start learning
          <svg
            className="ml-2 w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>

      {/* Right Side: Image */}
      <div className="flex-1">
        <Image
          src="/images/Elevio_banner_image.png" // Ensure this is inside `public/images/`
          alt="People learning together"
          width={500} // Set appropriate dimensions
          height={300}
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
};

export default HeroSection;