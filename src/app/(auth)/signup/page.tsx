'use client';

import React, { useState } from 'react';
import { signupValidation } from '../../utits/validation';
import { userSignup } from '@/app/service/user/userApi';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const SignupPage = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const router = useRouter();

  // State for validation errors and loading state
  const [errors, setErrors] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // 🟢 Add loading state

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors(null); // Clear errors on change
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return; // 🛑 Prevent multiple clicks during loading

    console.log('🟢 Form submitted!');

    // Validate form data
    const validationResponse = signupValidation(formData);


    if (!validationResponse.status) {
      setErrors(validationResponse.message ?? null);
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrors('Passwords do not match');
      return;
    }

    console.log('✅ Passwords match!');

    setLoading(true); // 🔵 Start loading

    try {
      const response = await userSignup(formData);
      console.log("Form submission response",response);
      toast.success(response.message);
      router.push(`/otp?email=${response.email}`);
    } catch (error) {
      
    } finally {
      setLoading(false); // 🔴 Stop loading
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[300px] bg-gradient-to-br from-blue-50 to-purple-50 py-6">
      <div className="flex w-full max-w-2xl mx-4 h-auto">
        {/* Left section - Image */}
        <div className="flex-1 flex items-center justify-center p-6 bg-white rounded-l-xl shadow-lg">
          <div className="w-60">
            <img src="/images/StudentLogin.png" alt="Student signing up" className="w-full h-auto" />
          </div>
        </div>

        {/* Right section - Signup form */}
        <div className="flex-1 p-6 bg-white rounded-r-xl shadow-lg">
          <div className="h-full flex flex-col">
            <h2 className="text-xl font-semibold text-center mt-4 mb-4 text-gray-800">Sign Up</h2>

            <form className="flex-1 flex flex-col space-y-4 max-w-sm mx-auto" onSubmit={handleSubmit}>
              <div className="flex-1 space-y-4">
                <input
                  type="text"
                  name="username"
                  placeholder="Full Name"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm text-black"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm text-black"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm text-black"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm text-black"
                />

                {/* Error Message Display */}
                {errors && <p className="text-red-500 text-xs">{errors}</p>}

                <button
                  type="submit"
                  disabled={loading} // 🛑 Disable button while loading
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                >
                  {loading ? 'Loading...' : 'Sign Up'} {/* 🔄 Change text based on loading state */}
                </button>
              </div>

              {/* Bottom links */}
              <div className="flex justify-between text-xs text-gray-500 pt-2 mt-auto">
                <a href="#" className="hover:text-purple-600 hover:underline">Already have an account? Sign in</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
