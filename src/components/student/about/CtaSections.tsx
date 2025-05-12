import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const CtaSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Learning Journey?</h2>
          <p className="text-lg md:text-xl text-blue-100 mb-8">
            Join thousands of students who are already experiencing the benefits of
            personalized education with our premium features.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href={`/courses`} className="px-8 py-3 rounded-lg bg-white text-blue-900 font-medium hover:bg-blue-50 transition-all duration-300 flex items-center justify-center">
              Get Started Now 
              <ArrowRight size={20} className="ml-2" />
            </Link>
            <Link href={`/subscription`} className="px-8 py-3 rounded-lg bg-transparent border-2 border-white text-white font-medium hover:bg-white/10 transition-all duration-300">
              Explore Plans
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;