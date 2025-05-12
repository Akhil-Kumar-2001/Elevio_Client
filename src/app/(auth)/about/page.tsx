import React from 'react';
import AboutHero from '@/components/student/about/AboutHero';
import Features from '@/components/student/about/Features';
import Testimonials from '@/components/student/about/Testimonials';
import Stats from '@/components/student/about/Stats';
import CtaSection from '@/components/student/about/CtaSections';
import AboutFooter from '@/components/student/about/AboutFooter';
import Navbar from '@/components/student/navbar';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <AboutHero />
      <Features />
      <Stats />
      <Testimonials />
      <CtaSection />
      <AboutFooter />
    </div>
  );
};

export default About;