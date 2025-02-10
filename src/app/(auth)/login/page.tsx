'use client'

import React from 'react';

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="flex w-full max-w-2xl mx-4 h-[400px]">
        {/* Left section - Image */}
        <div className="flex-1 flex items-center justify-center p-6 bg-white rounded-l-xl shadow-lg">
          <div className="w-60">
            <img 
              src="/images/StudentLogin.png"
              alt="Student studying"
              className="w-full h-auto"
            />
          </div>
        </div>
        
        {/* Right section - Login form */}
        <div className="flex-1 p-6 bg-white rounded-r-xl shadow-lg">
          <div className="h-full flex flex-col">
            <h2 className="text-xl font-semibold text-center mt-6 mb-6 text-gray-800">Sign In</h2>
            
            <form className="flex-1 flex flex-col space-y-4 max-w-sm mx-auto">
              <div className="flex-1 space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm"
                />
                
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm"
                />
                
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                  Sign in
                </button>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 text-gray-500 bg-white">Or continue with</span>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Bottom links */}
              <div className="flex justify-between text-xs text-gray-500 pt-4 mt-auto">
                <a href="#" className="hover:text-purple-600 hover:underline">Forgot password?</a>
                <a href="#" className="hover:text-purple-600 hover:underline">Register now</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;