import React from 'react';
import { Users, BookOpen, Video, Award } from 'lucide-react';

interface StatProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const Stat = ({ icon, value, label }: StatProps) => {
  return (
    <div className="text-center p-6 rounded-lg">
      <div className="flex justify-center mb-3">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          {icon}
        </div>
      </div>
      <div className="font-bold text-3xl md:text-4xl text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600 uppercase tracking-wider">{label}</div>
    </div>
  );
};

const Stats = () => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Impact by the Numbers</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Elevio continues to grow and make a difference in education worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Stat 
            icon={<Users size={28} />}
            value="25,000+"
            label="Active Students"
          />
          <Stat 
            icon={<BookOpen size={28} />}
            value="1,200+"
            label="Courses Available"
          />
          <Stat 
            icon={<Video size={28} />}
            value="50,000+"
            label="Video Sessions"
          />
          <Stat 
            icon={<Award size={28} />}
            value="98%"
            label="Satisfaction Rate"
          />
        </div>
      </div>
    </section>
  );
};

export default Stats;