import React from 'react';
import { Video, MessageSquare, Infinity, BookOpen, Users, Target } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isPremium?: boolean;
}

const FeatureCard = ({ icon, title, description, isPremium = false }: FeatureCardProps) => {
  return (
    <div className="relative bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100 group overflow-hidden">
      {isPremium && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          PREMIUM
        </div>
      )}
      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Features = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Learning Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Elevio offers a comprehensive set of features designed to enhance your learning experience
            and help you achieve your educational goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Video size={24} />}
            title="One-to-One Video Calls"
            description="Connect face-to-face with expert tutors for personalized learning sessions tailored to your needs."
            isPremium={true}
          />
          <FeatureCard 
            icon={<MessageSquare size={24} />}
            title="Direct Tutor Chat"
            description="Get your questions answered quickly with our direct messaging system to tutors."
            isPremium={true}
          />
          <FeatureCard 
            icon={<Infinity size={24} />}
            title="Unlimited Courses"
            description="Access our entire library of courses with no restrictions on how many you can take."
            isPremium={true}
          />
          <FeatureCard 
            icon={<BookOpen size={24} />}
            title="Extensive Library"
            description="Thousands of courses covering a wide range of subjects and skill levels."
          />
          <FeatureCard 
            icon={<Users size={24} />}
            title="Community Learning"
            description="Join study groups and forums to collaborate with fellow learners."
          />
          <FeatureCard 
            icon={<Target size={24} />}
            title="Progress Tracking"
            description="Monitor your learning journey with detailed analytics and achievement badges."
          />
        </div>
      </div>
    </section>
  );
};

export default Features;