import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Award, DollarSign, Users } from 'lucide-react';

export default function TutorSection() {
  return (
    <section id="tutors" className="py-24 overflow-hidden bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Image Column */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <div className="relative">
              {/* Background elements */}
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply opacity-70 animate-pulse-slow"></div>
              <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply opacity-70"></div>
              
              {/* Tutor image container */}
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl animate-fade-in-right">
                <div className="aspect-[4/3] relative">
                  <Image
                    src="/images/TeachingImage.jpeg"
                    alt="Instructor teaching online"
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Stats card */}
                <div className="absolute -bottom-1 -right-0 mr-2 mb-2 bg-white rounded-xl shadow-lg p-4 animate-float">
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold text-pink-600">₹1,25,000</div>
                    <div className="text-sm text-gray-500">Avg. Monthly Earnings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Column */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <div className="max-w-lg mx-auto lg:mx-0">
              <h2 className="text-sm font-semibold text-pink-600 uppercase tracking-wide">For Educators</h2>
              <h3 className="mt-2 text-4xl font-bold text-gray-900 md:text-5xl">Become an Instructor</h3>
              
              <p className="mt-4 text-lg text-gray-600">
                Share your expertise with the world. Create engaging courses, 
                build your audience, and earn income while making a difference in students' lives.
              </p>
              
              <div className="mt-8 space-y-4">
                {[
                  { 
                    icon: <Award className="h-6 w-6 text-pink-600" />, 
                    title: 'Showcase your expertise', 
                    description: 'Establish yourself as an authority in your field'
                  },
                  { 
                    icon: <DollarSign className="h-6 w-6 text-pink-600" />, 
                    title: 'Earn passive income', 
                    description: 'Get paid every time a student enrolls in your course'
                  },
                  { 
                    icon: <Users className="h-6 w-6 text-pink-600" />, 
                    title: 'Build your community', 
                    description: 'Connect directly with students through chat and video calls'
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">{item.icon}</div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">{item.title}</h4>
                      <p className="mt-1 text-gray-500">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10">
                <Link 
                  href="/tutor/signup" 
                  className="inline-flex items-center rounded-full bg-pink-600 px-8 py-3 text-base font-medium text-white shadow-md transition-all hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                >
                  Start Teaching Today
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}