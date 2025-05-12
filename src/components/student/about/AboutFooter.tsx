import React from 'react';
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

const AboutFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <GraduationCap className="text-blue-400 mr-2" size={24} />
              <span className="text-white text-xl font-bold">Elevio</span>
            </div>
            <p className="mb-4 text-gray-400">
              Transforming education through personalized learning experiences and one-to-one connections.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Courses</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Tutors</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail size={20} className="mr-3 text-gray-400 shrink-0 mt-1" />
                <span>support@elevio.com</span>
              </li>
              <li className="flex items-start">
                <Phone size={20} className="mr-3 text-gray-400 shrink-0 mt-1" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 mt-8 border-t border-gray-800 text-sm text-gray-400 text-center">
          <p>&copy; {new Date().getFullYear()} Elevio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default AboutFooter;