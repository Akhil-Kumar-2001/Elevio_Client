import React, { useEffect, useState } from 'react';
import { ArrowRight, Play, Users, BookOpen, Award, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const words = ["anywhere", "anytime", "together", "with experts"];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      const timeout = setTimeout(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsAnimating(false);
      }, 800);
      return () => clearTimeout(timeout);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen mt-8 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-400 rounded-full blur-3xl"></div>
      </div>

      {/* Geometric Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <svg className="absolute top-32 right-32 w-24 h-24 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        <svg className="absolute bottom-32 left-32 w-32 h-32 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/>
        </svg>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          {/* Left Content */}
          <div className="flex-1 max-w-2xl">

            {/* Main Heading */}
            <div className={`transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 leading-tight mb-6">
                Learn from{' '}
                <span className="relative inline-block min-w-[240px] lg:min-w-[280px]">
                  <span 
                    className={`bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${
                      isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
                    }`}
                  >
                    {words[currentWordIndex]}
                  </span>
                </span>
              </h1>
            </div>

            {/* Description */}
            <div className={`transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <p className="text-xl text-slate-600 leading-relaxed mb-8">
                Gain new skills and knowledge from our expert-led courses. 
                Learn at your own pace, anytime and anywhere with our cutting-edge platform.
              </p>
            </div>

            {/* Stats */}
            <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="flex flex-wrap gap-8 mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-800">50K+</div>
                    <div className="text-sm text-slate-600">Students</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-800">200+</div>
                    <div className="text-sm text-slate-600">Courses</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-800">95%</div>
                    <div className="text-sm text-slate-600">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className={`transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={`/courses`} className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden">
                  <span className="relative z-10">Start learning</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 w-0 group-hover:w-full transition-all duration-500 ease-out"></span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className={`flex-1 max-w-2xl transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10"></div>
                 <Image 
                  src={`/images/HeroSection.webp`}
                  width={500}
                  height={300}
                  alt="Students learning together on laptops" 
                  className="w-full h-96 lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Elements */}
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg z-20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">Chat with Tutor</div>
                      <div className="text-xs text-slate-600">Available now</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg z-20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">Course Complete</div>
                      <div className="text-xs text-slate-600">Certificate Earned</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>

        {/* Bottom Features */}
        <div className={`mt-20 transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Expert-Led Courses</h3>
              <p className="text-slate-600">Learn from industry professionals with years of experience</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">1-on-1 Video Sessions</h3>  
              <p className="text-slate-600">Schedule personalized tutoring sessions with expert instructors</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Certified Learning</h3>
              <p className="text-slate-600">Earn recognized certificates upon course completion</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;