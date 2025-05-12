'use client';

import React from 'react';
import Navbar from '@/components/student/navbar';
import HeroSection from '@/components/student/heroSection'; // Import the HeroSection component
import SubscriptionBanner from '@/components/student/subscriptionBanner';
import WhatToLearnNext from '@/components/student/courseList';
import Footer from '@/components/student/footer';
import TopRated from '@/components/student/topRatedCourse';
import AboutFooter from '@/components/student/about/AboutFooter';

const Homepage = () => {

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroSection />
      <SubscriptionBanner />
      <WhatToLearnNext />
      <TopRated />
      {/* <Footer /> */}
      <AboutFooter />

    </div>
  );
};

export default Homepage;