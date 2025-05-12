import React from 'react';
import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

const AboutHero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-900 text-white">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-10 md:mb-0 md:pr-12">
            <div className="flex items-center mb-6">
              <GraduationCap size={36} className="mr-3 text-blue-300" />
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-blue-50">
                About Elevio
              </h1>
            </div>
            <h2 className="text-xl md:text-2xl font-light mb-6 text-blue-100">
              Transforming education through personalized learning experiences
            </h2>
            <p className="text-lg md:text-xl leading-relaxed text-blue-50 mb-8 max-w-2xl">
              Elevio is a cutting-edge learning platform designed to connect students with expert tutors
              through technology. We believe that personalized education leads to better outcomes,
              which is why we've built a platform that prioritizes one-to-one connections.
            </p>
            <div className="flex flex-wrap gap-4">
              {/* <button className="px-8 py-3 rounded-full bg-white text-blue-900 font-medium hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Join Elevio
              </button> */}
              <Link href={`/home`} className="px-8 py-3 rounded-full bg-transparent border-2 border-white text-white font-medium hover:bg-white/10 transition-all duration-300">
                Explore Features
              </Link>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="w-64 h-64 md:w-80 md:h-80 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full opacity-70 animate-pulse" style={{ animationDuration: '3s' }}></div>
              <div className="absolute inset-4 bg-white/90 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-5xl font-bold text-blue-900">25k+</p>
                  <p className="text-blue-800 font-medium mt-2">Active Students</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default AboutHero;