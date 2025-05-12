'use client';

import { useState } from 'react';
import { MessageSquare, Video, CreditCard, Calendar, Users, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import FeatureCard from '@/components/Landingpage/sections/FeatureCard';

export default function FeaturesSection() {
  const [activeTab, setActiveTab] = useState('students');
  
  const features = {
    students: [
      {
        icon: <MessageSquare className="h-8 w-8" />,
        title: 'Chat with Tutors',
        description: 'Get instant answers to your questions through our messaging system',
      },
      {
        icon: <Video className="h-8 w-8" />,
        title: 'Video Consultations',
        description: 'Schedule one-on-one video calls with tutors for in-depth learning',
      },
      {
        icon: <CreditCard className="h-8 w-8" />,
        title: 'Flexible Subscriptions',
        description: 'Choose plans that fit your learning needs and budget',
      },
    ],
    tutors: [
      {
        icon: <Calendar className="h-8 w-8" />,
        title: 'Schedule Classes',
        description: 'Organize your teaching schedule with our intuitive calendar system',
      },
      {
        icon: <Users className="h-8 w-8" />,
        title: 'Manage Students',
        description: 'Track progress and engagement of your student community',
      },
      {
        icon: <BookOpen className="h-8 w-8" />,
        title: 'Create Courses',
        description: 'Build engaging courses with our easy-to-use content tools',
      },
    ],
  };

  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold text-pink-600 uppercase tracking-wide">Features</h2>
          <h3 className="mt-2 text-4xl font-bold text-gray-900 md:text-5xl">Everything You Need</h3>
          <p className="mt-4 text-xl text-gray-500">
            Our platform provides powerful tools for both students and tutors
            to create an effective learning environment.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 rounded-full bg-gray-100">
            {['students', 'tutors'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-6 py-3 text-sm font-medium rounded-full transition-all',
                  activeTab === tab
                    ? 'bg-white text-pink-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                For {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features[activeTab as keyof typeof features].map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}