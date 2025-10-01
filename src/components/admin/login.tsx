'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { motion } from 'framer-motion';

import { adminSignin } from '@/app/service/admin/adminApi';
import useAdminAuthStore from '@/store/adminAuthStore';

// Login validation schema
const loginSchema = z.object({
  email: z.string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .max(100, { message: "Email must be less than 100 characters" }),

  password: z.string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
});

// Type for login form data
type LoginFormData = z.infer<typeof loginSchema>;

// Validation function that returns field-specific errors
const validateLoginForm = (data: LoginFormData) => {
  try {
    loginSchema.parse(data);
    return {
      status: true,
      errors: {}
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const sortedErrors = error.errors.sort((a) =>
        a.message.includes("is required") ? -1 : 1
      );

      const fieldErrors = sortedErrors.reduce((acc, err) => {
        const path = err.path[0] as string;
        if (!acc[path]) {
          acc[path] = err.message;
        }
        return acc;
      }, {} as Record<string, string>);

      return {
        status: false,
        errors: fieldErrors
      };
    }
    return {
      status: false,
      errors: { general: "An unknown error occurred" }
    };
  }
};

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const adminAuth = useAdminAuthStore();

  useEffect(() => {
    if (adminAuth.isAuthenticated) {
      router.replace('/admin/dashboard');
    }
  }, [adminAuth.isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    // Validate form
    const validationResponse = validateLoginForm(formData);
    if (!validationResponse.status) {
      setErrors(validationResponse.errors);
      return;
    }

    setLoading(true);

    try {
      const response = await adminSignin(formData);
      adminAuth.saveUserDetails(response.data);

      toast.success(response.message);
      window.history.replaceState(null, '', '/admin/dashboard');
      router.replace('/admin/dashboard');
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error && error.response) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          setErrors({ general: axiosError.response.data.message });
        } else {
          setErrors({ general: 'Invalid email or password' });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900/30 to-gray-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md bg-gradient-to-b from-gray-900/60 to-gray-900/40 backdrop-blur-2xl rounded-3xl shadow-xl shadow-gray-950/50 p-10 border border-gray-700/50"
      >
        <motion.div
          animate={{ boxShadow: ["0 0 10px rgba(255, 215, 0, 0.2)", "0 0 20px rgba(255, 215, 0, 0.3)", "0 0 10px rgba(255, 215, 0, 0.2)"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-3xl -z-10"
        />
        <h2 className="text-4xl font-extrabold text-center  text-center text-white mb-10 font-poppins tracking-wide">
          Admin Sign In
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <motion.input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-5 py-4 bg-gray-900 text-white placeholder-gray-300 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-xl focus:ring-4 focus:ring-gold-400/50 focus:border-gold-400 focus:shadow-[0_0_15px_rgba(255,215,0,0.4)] outline-none transition-all duration-300 font-poppins text-sm shadow-inner shadow-gray-950/50`}
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-2 font-poppins">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <motion.input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-5 py-4 bg-gray-900 text-white placeholder-gray-300 border ${errors.password ? 'border-red-500' : 'border-gray-700'} rounded-xl focus:ring-4 focus:ring-gold-400/50 focus:border-gold-400 focus:shadow-[0_0_15px_rgba(255,215,0,0.4)] outline-none transition-all duration-300 font-poppins text-sm pr-12 shadow-inner shadow-gray-950/50`}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white focus:outline-none transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-2 font-poppins">{errors.password}</p>
            )}
          </div>

          {errors.general && (
            <p className="text-red-400 text-sm text-center font-poppins">{errors.general}</p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 font-poppins text-sm ${loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 shadow-lg'}`}
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255, 215, 0, 0.6)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {loading ? 'Loading...' : 'Sign In'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;