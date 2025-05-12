'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Landingpage/layout/Navbar';
import HeroSection from '@/components/Landingpage/sections/HeroSection';
import TutorSection from '@/components/Landingpage/sections/TutorSection';
import StudentSection from '@/components/Landingpage/sections/StudentSection';
import FeaturesSection from '@/components/Landingpage/sections/FeaturesSection';
import Footer from '@/components/Landingpage/layout/Footer';
import { initAnimations } from '@/lib/animations';

export default function LandingPage() {
  useEffect(() => {
    // Initialize animations when component mounts
    initAnimations();
  }, []);

  return (
    <div className="overflow-hidden">
      <Navbar />
      <HeroSection />
      <TutorSection />
      <StudentSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}