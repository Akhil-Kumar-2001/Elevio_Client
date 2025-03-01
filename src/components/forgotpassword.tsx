'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { studentForgotPassword } from '@/app/service/user/userApi';
import { tutorForgotPassword } from '@/app/service/tutor/tutorApi';

interface ForgotPasswordPageProps {
  role: 'student' | 'tutor';
}

const ForgotPassword: React.FC<ForgotPasswordPageProps> = ({ role }) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const authImage = role === 'student' ? '/images/StudentLogin.png' : '/images/TutorLogin.png';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrors(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!email) {
      setErrors('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const forgotApi = role == 'student' ? studentForgotPassword : tutorForgotPassword
      const response = await forgotApi(email)
      toast.success(response.message)
      role === 'student'? router.push(`/forgototp?email=${response.email}`) : router.push(`/tutor/forgototp?email=${response.email}`) 
    } catch (error) {
      setErrors('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="flex w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Left section - Image */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-12">
          <img
            src={authImage}
            alt={role === 'student' ? "Student studying" : "Tutor teaching"}
            className="w-full h-auto"
          />
        </div>

        {/* Right section - Forgot Password form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="h-full flex flex-col">
            <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
              Forgot Password
            </h2>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6 max-w-sm mx-auto w-full">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-black"
              />

              {errors && <p className="text-red-500 text-sm text-center">{errors}</p>}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>

              <div className="flex justify-between text-sm text-gray-500 mt-8">
                {role === "student" ? (
                  <>
                    <a href="/login" className="hover:text-purple-600 hover:underline">Back to login ?</a>
                  </>
                ) :
                  (<>
                    <a href="/tutor/login" className="hover:text-purple-600 hover:underline">Back to login ?</a>
                  </>)
                }

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;