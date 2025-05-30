'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Pencil, GraduationCap, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { resetPassword as StudentResetPassword } from '@/app/service/user/userApi';

const ResetPasswordPage: React.FC = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const emailFromQuery = searchParams.get('email');
    setEmail(emailFromQuery ?? '');
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors(null);
  };

  const validatePasswords = () => {
    if (!formData.password) {
      setErrors('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      setErrors('Password must be at least 8 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrors('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!validatePasswords()) return;

    setLoading(true);

    try {
      const response = await StudentResetPassword(formData.password, email);
      if (response) {
        toast.success(response.message);
        router.back();
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setErrors('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  // Shared animation props for 3D book
  const bookAnimationProps = {
    className: 'relative w-48 h-32 rounded-lg shadow-xl',
    style: { willChange: 'transform, box-shadow' } as React.CSSProperties,
    glow: (
      <motion.div
        className="absolute inset-0 bg-teal-600 rounded-lg bg-gradient-to-r from-teal-500 to-teal-700"
        animate={{
          boxShadow: [
            '0 10px 20px rgba(13, 148, 136, 0.3), 0 0 20px rgba(13, 148, 136, 0.2)',
            '0 15px 30px rgba(13, 148, 136, 0.4), 0 0 30px rgba(13, 148, 136, 0.3)',
            '0 10px 20px rgba(13, 148, 136, 0.3), 0 0 20px rgba(13, 148, 136, 0.2)',
          ],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute inset-2 bg-white rounded-lg flex items-center justify-center z-10">
          <span className="text-teal-600 font-poppins font-bold text-xl">Reset</span>
        </div>
      </motion.div>
    ),
    float: (
      <motion.div
        animate={{ y: [0, -15] }}
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
    ),
  };

  // Shared animation props for orbiting icons
  const iconAnimationProps = {
    orbit: {
      className: 'absolute',
      animate: { rotate: 360 },
      transition: { duration: 25, repeat: Infinity, ease: 'linear' },
      style: { willChange: 'transform' } as React.CSSProperties,
    },
    icon: (x: number, y: number, delay: number, Icon: React.ComponentType<{ className: string }>) => (
      <motion.div
        className="absolute w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md"
        style={{ x, y }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: [1, 1.3, 1] }}
        transition={{
          opacity: { duration: 0.5, delay },
          scale: { duration: 3, repeat: Infinity, delay, ease: 'easeInOut' },
        }}
      >
        <Icon className="w-6 h-6 text-teal-600" />
      </motion.div>
    ),
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
        <div className="lg:w-1/2 bg-gradient-to-b from-teal-50 to-gray-100 p-12 flex flex-col items-center justify-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeInOut' }}
            className="text-center z-10"
          >
            <motion.h1
              className="text-5xl font-extrabold text-teal-600 font-poppins mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-400"
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
              className="text-lg text-gray-700 font-poppins mb-8"
            >
              Empowering Learning
            </motion.p>
          </motion.div>

          {/* 3D Book with Glow */}
          <motion.div {...bookAnimationProps}>
            {bookAnimationProps.glow}
            {bookAnimationProps.float}
          </motion.div>

          {/* Orbiting Knowledge Icons */}
          <motion.div {...iconAnimationProps.orbit}>
            {iconAnimationProps.icon(120, 0, 0.5, Pencil)}
            {iconAnimationProps.icon(-120, 0, 0.7, GraduationCap)}
            {iconAnimationProps.icon(0, 120, 0.9, Globe)}
          </motion.div>
        </div>

        {/* Right Section: Reset Password Form */}
        <div className="lg:w-1/2 p-8 flex flex-col justify-center bg-gradient-to-b from-white to-gray-50 overflow-y-auto">
          <motion.h2
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl font-extrabold text-center text-gray-900 mb-8 font-poppins tracking-wide"
          >
            Reset Password
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto w-full">
            <div className="relative">
              <motion.input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="New Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-3 bg-gray-50 text-gray-900 placeholder-gray-400 border-b-2 ${errors ? 'border-red-500' : 'border-gray-200 focus:border-teal-600'} focus:shadow-[0_0_12px_rgba(13,148,136,0.4)] outline-none transition-all duration-300 font-poppins text-base pr-10`}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                aria-label="New password"
                aria-describedby={errors && formData.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-600 focus:outline-none transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
              {errors && formData.password && (
                <p id="password-error" className="text-red-500 text-sm mt-1 font-poppins">{errors}</p>
              )}
            </div>

            <div className="relative">
              <motion.input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-3 bg-gray-50 text-gray-900 placeholder-gray-400 border-b-2 ${errors ? 'border-red-500' : 'border-gray-200 focus:border-teal-600'} focus:shadow-[0_0_12px_rgba(13,148,136,0.4)] outline-none transition-all duration-300 font-poppins text-base pr-10`}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                aria-label="Confirm new password"
                aria-describedby={errors && formData.confirmPassword ? 'confirm-password-error' : undefined}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-600 focus:outline-none transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
              {errors && formData.confirmPassword && (
                <p id="confirm-password-error" className="text-red-500 text-sm mt-1 font-poppins">{errors}</p>
              )}
            </div>

            {errors && !formData.password && !formData.confirmPassword && (
              <p className="text-red-500 text-sm text-center font-poppins">{errors}</p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 font-poppins text-base ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg'}`}
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(13, 148, 136, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              aria-label={loading ? 'Resetting password' : 'Reset password'}
              aria-busy={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </motion.button>

            <div className="text-base text-gray-600 text-center font-poppins">
              Password must be at least 8 characters long
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;