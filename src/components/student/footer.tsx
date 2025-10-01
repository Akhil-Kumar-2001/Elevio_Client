import React, { useEffect, useState } from 'react';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-blue-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 relative overflow-hidden">
        {/* Decorative Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-transparent opacity-50"></div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8 relative z-10">
          {/* Company Column */}
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h3 className="text-lg font-semibold mb-4 uppercase text-white">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-600 hover:bg-clip-text transition-colors duration-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-600 hover:bg-clip-text transition-colors duration-300">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-600 hover:bg-clip-text transition-colors duration-300">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-600 hover:bg-clip-text transition-colors duration-300">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className={`transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h3 className="text-lg font-semibold mb-4 uppercase text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-600 hover:bg-clip-text transition-colors duration-300">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-600 hover:bg-clip-text transition-colors duration-300">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-600 hover:bg-clip-text transition-colors duration-300">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-600 hover:bg-clip-text transition-colors duration-300">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Features Column */}
          <div className={`transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h3 className="text-lg font-semibold mb-4 uppercase text-white">Features</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-600 hover:bg-clip-text transition-colors duration-300">
                  Live Classes
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-600 hover:bg-clip-text transition-colors duration-300">
                  Projects
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-600 hover:bg-clip-text transition-colors duration-300">
                  Certificates
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-600 hover:bg-clip-text transition-colors duration-300">
                  Career Support
                </a>
              </li>
            </ul>
          </div>

          {/* Connect with Us Column */}
          <div className={`transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h3 className="text-lg font-semibold mb-4 uppercase text-white">Connect with us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-600 hover:bg-clip-text transition-colors duration-300">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-600 hover:bg-clip-text transition-colors duration-300">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-600 hover:bg-clip-text transition-colors duration-300">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-9.019-7.619-11.018-3.869v-2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className={`mt-10 text-center text-sm text-gray-400 relative z-10 transform transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <p className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            &copy; {new Date().getFullYear()} Elevio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;