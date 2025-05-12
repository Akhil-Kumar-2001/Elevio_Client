import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-pink-100 to-white pb-16 pt-36 md:pt-40 lg:pt-48">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 transform opacity-20">
        <div className="h-[600px] w-[600px] rounded-full bg-pink-300 blur-3xl"></div>
      </div>
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 transform opacity-20">
        <div className="h-[400px] w-[400px] rounded-full bg-purple-300 blur-3xl"></div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-1/4 right-10 hidden animate-float-slow opacity-50 lg:block">
        <div className="h-20 w-20 rounded-full bg-pink-200"></div>
      </div>
      <div className="absolute top-1/3 left-10 hidden animate-float opacity-40 lg:block">
        <div className="h-12 w-12 rounded-full bg-purple-200"></div>
      </div>

      <div className="container relative mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="max-w-3xl text-center lg:text-left">
            <h1 className="animate-fade-in-up mb-6 text-5xl font-bold tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                Education Simplified,
              </span>
              <span>Learning Amplified</span>
            </h1>

            <p className="animate-fade-in-up-delay-1 mb-10 text-lg text-gray-700 md:text-xl">
              Where teaching and learning come together in a seamless digital experience. 
              Create courses, connect with experts, and learn at your own pace.
            </p>

            <div className="animate-fade-in-up-delay-2 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 md:justify-center lg:justify-start">
              <Link 
                href="/signup" 
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-600 to-purple-600 px-8 py-3 text-base font-medium text-white shadow-md transition-all hover:from-pink-700 hover:to-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="#features" 
                className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                Explore Features
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative animate-fade-in-left">
              <div className="absolute -left-10 -top-10 h-72 w-72 rounded-full bg-purple-100 mix-blend-multiply blur-xl"></div>
              <div className="absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-pink-100 mix-blend-multiply blur-xl"></div>
              
              <div className="relative mx-auto rounded-2xl bg-white p-4 shadow-xl">
                <Image 
                  src="/images/StudentLearning.jpeg" 
                  alt="Students learning online" 
                  width={600} 
                  height={400}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { value: '10K+', label: 'Active Students' },
            { value: '500+', label: 'Expert Tutors' },
            { value: '1.2K+', label: 'Courses Available' },
            { value: '98%', label: 'Satisfaction Rate' },
          ].map((stat, index) => (
            <div 
              key={index} 
              className="animate-fade-in-up-delay-3 flex flex-col items-center justify-center rounded-lg bg-white/50 p-6 text-center backdrop-blur-sm"
            >
              <div className="text-3xl font-bold text-pink-600 md:text-4xl">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}