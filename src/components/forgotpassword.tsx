'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Pencil, GraduationCap, Globe, Pen, Book, Users } from 'lucide-react';
import { motion } from 'framer-motion';

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
      const forgotApi = role === 'student' ? studentForgotPassword : tutorForgotPassword;
      const response = await forgotApi(email);
      toast.success(response.message);
      if (role === 'student') {
        window.history.replaceState(null, '', `/forgototp?email=${response.email}`);
        router.push(`/forgototp?email=${response.email}`);
      } else {
        window.history.replaceState(null, '', `/tutor/forgototp?email=${response.email}`);
        router.push(`/tutor/forgototp?email=${response.email}`);
      }
    } catch (error) {
      console.log(error);
      setErrors('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-xl flex flex-col lg:flex-row h-[90vh] overflow-hidden"
      >
        {/* Left Section: Engaging Visual */}
        <div className="lg:w-1/2 bg-gradient-to-b from-teal-50 to-gray-100 p-8 flex flex-col items-center justify-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeInOut' }}
            className="text-center z-10"
          >
            <motion.h1
              className="text-4xl font-extrabold text-teal-600 font-poppins mb-3 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-400"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ willChange: 'transform' }}
            >
              Elevio
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeInOut' }}
              className="text-base text-gray-700 font-poppins mb-6"
            >
              Empowering Learning
            </motion.p>
          </motion.div>

          {role === 'student' ? (
            <>
              {/* 3D Book with Glow */}
              <motion.div
                className="relative w-40 h-24 rounded-lg shadow-xl"
                style={{ willChange: 'transform, box-shadow' }}
              >
                <motion.div
                  className="absolute inset-0 bg-teal-600 rounded-lg bg-gradient-to-r from-teal-500 to-teal-700"
                  animate={{
                    boxShadow: [
                      '0 8px 16px rgba(13, 148, 136, 0.3), 0 0 16px rgba(13, 148, 136, 0.2)',
                      '0 12px 24px rgba(13, 148, 136, 0.4), 0 0 24px rgba(13, 148, 136, 0.3)',
                      '0 8px 16px rgba(13, 148, 136, 0.3), 0 0 16px rgba(13, 148, 136, 0.2)',
                    ],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="absolute inset-2 bg-white rounded-lg flex items-center justify-center z-10">
                    <span className="text-teal-600 font-poppins font-bold text-lg">Reset</span>
                  </div>
                </motion.div>
                <motion.div
                  animate={{ y: [0, -12] }}
                  transition={{
                    y: {
                      type: 'spring',
                      stiffness: 50,
                      damping: 20,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      duration: 3,
                    },
                  }}
                >
                  <motion.div
                    animate={{ rotateY: [0, 15, 0, -15, 0] }}
                    transition={{
                      rotateY: {
                        duration: 5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      },
                    }}
                  />
                </motion.div>
              </motion.div>

              {/* Orbiting Knowledge Icons for Student */}
              <motion.div
                className="absolute"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                style={{ willChange: 'transform' }}
              >
                <motion.div
                  className="absolute w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
                  style={{ x: 100, y: 0 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: [1, 1.3, 1] }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.5 },
                    scale: { duration: 3, repeat: Infinity, delay: 0.5, ease: 'easeInOut' },
                  }}
                >
                  <Pencil className="w-5 h-5 text-teal-600" />
                </motion.div>
                <motion.div
                  className="absolute w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
                  style={{ x: -100, y: 0 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: [1, 1.3, 1] }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.7 },
                    scale: { duration: 3, repeat: Infinity, delay: 0.7, ease: 'easeInOut' },
                  }}
                >
                  <GraduationCap className="w-5 h-5 text-teal-600" />
                </motion.div>
                <motion.div
                  className="absolute w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
                  style={{ x: 0, y: 100 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: [1, 1.3, 1] }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.9 },
                    scale: { duration: 3, repeat: Infinity, delay: 0.9, ease: 'easeInOut' },
                  }}
                >
                  <Globe className="w-5 h-5 text-teal-600" />
                </motion.div>
              </motion.div>
            </>
          ) : (
            <>
              {/* 3D Clipboard with Glow */}
              <motion.div
                className="relative w-40 h-24 rounded-lg shadow-xl"
                style={{ willChange: 'transform, box-shadow' }}
              >
                <motion.div
                  className="absolute inset-0 bg-teal-600 rounded-lg bg-gradient-to-r from-teal-500 to-teal-700"
                  animate={{
                    boxShadow: [
                      '0 8px 16px rgba(13, 148, 136, 0.3), 0 0 16px rgba(13, 148, 136, 0.2)',
                      '0 12px 24px rgba(13, 148, 136, 0.4), 0 0 24px rgba(13, 148, 136, 0.3)',
                      '0 8px 16px rgba(13, 148, 136, 0.3), 0 0 16px rgba(13, 148, 136, 0.2)',
                    ],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="absolute inset-2 bg-white rounded-lg flex items-center justify-center z-10">
                    <span className="text-teal-600 font-poppins font-bold text-lg">Reset</span>
                  </div>
                </motion.div>
                <motion.div
                  animate={{ y: [0, -12] }}
                  transition={{
                    y: {
                      type: 'spring',
                      stiffness: 50,
                      damping: 20,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      duration: 3,
                    },
                  }}
                >
                  <motion.div
                    animate={{ rotateY: [0, 15, 0, -15, 0] }}
                    transition={{
                      rotateY: {
                        duration: 5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      },
                    }}
                  />
                </motion.div>
              </motion.div>

              {/* Orbiting Knowledge Icons for Tutor */}
              <motion.div
                className="absolute"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                style={{ willChange: 'transform' }}
              >
                <motion.div
                  className="absolute w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
                  style={{ x: 100, y: 0 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: [1, 1.3, 1] }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.5 },
                    scale: { duration: 3, repeat: Infinity, delay: 0.5, ease: 'easeInOut' },
                  }}
                >
                  <Pen className="w-5 h-5 text-teal-600" />
                </motion.div>
                <motion.div
                  className="absolute w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
                  style={{ x: -100, y: 0 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: [1, 1.3, 1] }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.7 },
                    scale: { duration: 3, repeat: Infinity, delay: 0.7, ease: 'easeInOut' },
                  }}
                >
                  <Book className="w-5 h-5 text-teal-600" />
                </motion.div>
                <motion.div
                  className="absolute w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
                  style={{ x: 0, y: 100 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: [1, 1.3, 1] }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.9 },
                    scale: { duration: 3, repeat: Infinity, delay: 0.9, ease: 'easeInOut' },
                  }}
                >
                  <Users className="w-5 h-5 text-teal-600" />
                </motion.div>
              </motion.div>
            </>
          )}
        </div>

        {/* Right Section: Forgot Password Form */}
        <div className="lg:w-1/2 p-8 flex flex-col justify-center bg-gradient-to-b from-white to-gray-50 overflow-y-auto">
          <motion.h2
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl font-extrabold text-center text-gray-900 mb-6 font-poppins tracking-wide"
          >
            Forgot Password
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-xs mx-auto w-full">
            <div className="relative">
              <motion.input
                type="email"
                name="email"
                placeholder="Email Address"
                value={email}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-50 text-gray-900 placeholder-gray-400 border-b-2 ${errors ? 'border-red-500' : 'border-gray-200 focus:border-teal-600'} focus:shadow-[0_0_12px_rgba(13,148,136,0.4)] outline-none transition-all duration-300 font-poppins text-sm`}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
              {errors && (
                <p className="text-red-500 text-xs mt-1 font-poppins">{errors}</p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 font-poppins text-sm ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg'}`}
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(13, 148, 136, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </motion.button>

            <div className="flex justify-center text-sm text-gray-600 mt-4 font-poppins">
              <a
                href={role === 'student' ? '/login' : '/tutor/login'}
                className="hover:text-teal-600 hover:underline transition duration-200"
              >
                Back to login?
              </a>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;