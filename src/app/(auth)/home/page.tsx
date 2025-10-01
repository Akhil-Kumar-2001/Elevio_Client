'use client';

import React, { useEffect } from 'react';
import Navbar from '@/components/student/navbar';
import HeroSection from '@/components/student/heroSection'; // Import the HeroSection component
import SubscriptionBanner from '@/components/student/subscriptionBanner';
import WhatToLearnNext from '@/components/student/courseList';
import TopRated from '@/components/student/topRatedCourse';
import AboutFooter from '@/components/student/about/AboutFooter';
import useAuthStore from '@/store/userAuthStore';
import { useRouter } from 'next/navigation';

const Homepage = () => {

  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const authToken = localStorage.getItem('authUserCheck');
    if (!authToken && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

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