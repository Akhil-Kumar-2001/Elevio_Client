'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Pencil, GraduationCap, Globe, Pen, Book, Users } from 'lucide-react';
import { z } from 'zod';
import { getSession, signIn } from 'next-auth/react';
import { motion } from 'framer-motion';

import { googleSignInApi as tutorGoogle, tutorSignin } from '@/app/service/tutor/tutorApi';
import { googleSignInApi as studentGoogle, studentSignin } from '@/app/service/user/userApi';

import useTutorAuthStore from '@/store/tutorAuthStore';
import useStudentAuthStore from '@/store/userAuthStore';
import Link from 'next/link';

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

interface LoginPageProps {
  role: 'student' | 'tutor';
}

const LoginPage: React.FC<LoginPageProps> = ({ role }) => {
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const studentAuth = useStudentAuthStore();
  const tutorAuth = useTutorAuthStore();

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
      const signInApi = role === 'student' ? studentSignin : tutorSignin;
      const authStore = role === 'student' ? studentAuth : tutorAuth;

      const response = await signInApi(formData);
      authStore.saveUserDetails(response.data);

      toast.success(response.message);
      if (role === 'student') {
        window.history.replaceState(null, '', '/home');
        router.replace('/home');
      } else {
        window.history.replaceState(null, '', '/tutor/dashboard');
        router.replace('/tutor/dashboard');
      }
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

  const handleGoogleLogin = async () => {
    try {
      const result = await signIn("google", role === 'student'
        ? { callbackUrl: '/home', redirect: false }
        : { callbackUrl: '/tutor/dashboard', redirect: false }
      );

      if (result?.error) {
        console.error("Sign-in failed", result.error);
        toast.error("Sign in using Google failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error during Google Sign-in");
    }
  };

  useEffect(() => {
    const checkSessionAndCallBackend = async () => {
      const session = await getSession();
      if (!session || !session.user) return;

      console.log("Session found, calling backend...");

      const userData = {
        username: session.user.name ?? "",
        email: session.user.email ?? "",
        image: session.user.image ?? "",
      };

      const googleApi = role === "student" ? studentGoogle : tutorGoogle;
      const authStore = role === "student" ? studentAuth : tutorAuth;

      try {
        const response = await googleApi(userData);
        authStore.saveUserDetails(response.data);
        toast.success(response.message, { toastId: "google-signin-success" });

        if (role === 'student') {
          window.history.replaceState(null, '', '/home');
          router.replace('/home');
        } else {
          window.history.replaceState(null, '', '/tutor/dashboard');
          router.replace('/tutor/dashboard');
        }
      } catch (error) {
        console.error(error);
        toast.error("Google authentication failed.");
      }
    };

    checkSessionAndCallBackend();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-xl flex flex-col lg:flex-row overflow-hidden"
      >
        {/* Left Section: Engaging Visual */}
        <div className="lg:w-1/2 bg-gradient-to-b from-teal-50 to-gray-100 p-12 flex flex-col items-center justify-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
            className="text-center z-10"
          >
            <motion.h1
              className="text-5xl font-extrabold text-teal-600 font-poppins mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-400"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ willChange: "transform" }}
            >
              Elevio
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
              className="text-lg text-gray-700 font-poppins mb-8"
            >
              Empowering Learning
            </motion.p>
          </motion.div>

          {role === 'student' ? (
            // Student: 3D Book with Orbiting Icons
            <>
              {/* 3D Book with Glow */}
              <motion.div
                className="relative w-48 h-32 rounded-lg shadow-xl"
                style={{ willChange: "transform, box-shadow" }}
              >
                {/* Outer Book Cover */}
                <motion.div
                  className="absolute inset-0 bg-teal-600 rounded-lg bg-gradient-to-r from-teal-500 to-teal-700"
                  animate={{
                    boxShadow: [
                      "0 10px 20px rgba(13, 148, 136, 0.3), 0 0 20px rgba(13, 148, 136, 0.2)",
                      "0 15px 30px rgba(13, 148, 136, 0.4), 0 0 30px rgba(13, 148, 136, 0.3)",
                      "0 10px 20px rgba(13, 148, 136, 0.3), 0 0 20px rgba(13, 148, 136, 0.2)",
                    ],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Inner White Page */}
                  <div className="absolute inset-2 bg-white rounded-lg flex items-center justify-center z-10">
                    <span className="text-teal-600 font-poppins font-bold text-xl">Learn</span>
                  </div>
                </motion.div>

                {/* Floating Animation with Spring */}
                <motion.div
                  animate={{ y: [0, -15] }}
                  transition={{
                    y: {
                      type: "spring",
                      stiffness: 50,
                      damping: 20,
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 3,
                    },
                  }}
                >
                  {/* Tilting Animation with Tween */}
                  <motion.div
                    animate={{ rotateY: [0, 15, 0, -15, 0] }}
                    transition={{
                      rotateY: {
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                  />
                </motion.div>
              </motion.div>

              {/* Orbiting Knowledge Icons for Student */}
              <motion.div
                className="absolute"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                style={{ willChange: "transform" }}
              >
                <motion.div
                  className="absolute w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md"
                  style={{ x: 120, y: 0 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: [1, 1.3, 1] }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.5 },
                    scale: { duration: 3, repeat: Infinity, delay: 0.5, ease: "easeInOut" },
                  }}
                >
                  <Pencil className="w-6 h-6 text-teal-600" />
                </motion.div>
                <motion.div
                  className="absolute w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md"
                  style={{ x: -120, y: 0 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: [1, 1.3, 1] }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.7 },
                    scale: { duration: 3, repeat: Infinity, delay: 0.7, ease: "easeInOut" },
                  }}
                >
                  <GraduationCap className="w-6 h-6 text-teal-600" />
                </motion.div>
                <motion.div
                  className="absolute w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md"
                  style={{ x: 0, y: 120 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: [1, 1.3, 1] }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.9 },
                    scale: { duration: 3, repeat: Infinity, delay: 0.9, ease: "easeInOut" },
                  }}
                >
                  <Globe className="w-6 h-6 text-teal-600" />
                </motion.div>
              </motion.div>
            </>
          ) : (
            // Tutor: 3D Clipboard with Orbiting Icons
            <>
              {/* 3D Clipboard with Glow */}
              <motion.div
                className="relative w-48 h-32 rounded-lg shadow-xl"
                style={{ willChange: "transform, box-shadow" }}
              >
                {/* Outer Clipboard Cover */}
                <motion.div
                  className="absolute inset-0 bg-teal-600 rounded-lg bg-gradient-to-r from-teal-500 to-teal-700"
                  animate={{
                    boxShadow: [
                      "0 10px 20px rgba(13, 148, 136, 0.3), 0 0 20px rgba(13, 148, 136, 0.2)",
                      "0 15px 30px rgba(13, 148, 136, 0.4), 0 0 30px rgba(13, 148, 136, 0.3)",
                      "0 10px 20px rgba(13, 148, 136, 0.3), 0 0 20px rgba(13, 148, 136, 0.2)",
                    ],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Inner White Page */}
                  <div className="absolute inset-2 bg-white rounded-lg flex items-center justify-center z-10">
                    <span className="text-teal-600 font-poppins font-bold text-xl">Teach</span>
                  </div>
                </motion.div>

                {/* Floating Animation with Spring */}
                <motion.div
                  animate={{ y: [0, -15] }}
                  transition={{
                    y: {
                      type: "spring",
                      stiffness: 50,
                      damping: 20,
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 3,
                    },
                  }}
                >
                  {/* Tilting Animation with Tween */}
                  <motion.div
                    animate={{ rotateY: [0, 15, 0, -15, 0] }}
                    transition={{
                      rotateY: {
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                  />
                </motion.div>
              </motion.div>

              {/* Orbiting Knowledge Icons for Tutor */}
              <motion.div
                className="absolute"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                style={{ willChange: "transform" }}
              >
                <motion.div
                  className="absolute w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md"
                  style={{ x: 120, y: 0 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: [1, 1.3, 1] }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.5 },
                    scale: { duration: 3, repeat: Infinity, delay: 0.5, ease: "easeInOut" },
                  }}
                >
                  <Pen className="w-6 h-6 text-teal-600" />
                </motion.div>
                <motion.div
                  className="absolute w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md"
                  style={{ x: -120, y: 0 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: [1, 1.3, 1] }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.7 },
                    scale: { duration: 3, repeat: Infinity, delay: 0.7, ease: "easeInOut" },
                  }}
                >
                  <Book className="w-6 h-6 text-teal-600" />
                </motion.div>
                <motion.div
                  className="absolute w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md"
                  style={{ x: 0, y: 120 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: [1, 1.3, 1] }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.9 },
                    scale: { duration: 3, repeat: Infinity, delay: 0.9, ease: "easeInOut" },
                  }}
                >
                  <Users className="w-6 h-6 text-teal-600" />
                </motion.div>
              </motion.div>
            </>
          )}
        </div>

        {/* Right Section: Login Form */}
        <div className="lg:w-1/2 p-12 flex flex-col justify-center bg-gradient-to-b from-white to-gray-50">
          <motion.h2
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl font-extrabold text-center text-gray-900 mb-10 font-poppins tracking-wide"
          >
            {role === 'student' ? 'Student Sign In' : 'Tutor Sign In'}
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-8 max-w-sm mx-auto w-full">
            <div className="relative">
              <motion.input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-50 text-gray-900 placeholder-gray-400 border-b-2 ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-teal-600'} focus:shadow-[0_0_12px_rgba(13,148,136,0.4)] outline-none transition-all duration-300 font-poppins text-sm`}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-2 font-poppins">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <motion.input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-50 text-gray-900 placeholder-gray-400 border-b-2 ${errors.password ? 'border-red-500' : 'border-gray-200 focus:border-teal-600'} focus:shadow-[0_0_12px_rgba(13,148,136,0.4)] outline-none transition-all duration-300 font-poppins text-sm pr-12`}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-600 focus:outline-none transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs mt-2 font-poppins">{errors.password}</p>
              )}
            </div>

            {errors.general && (
              <p className="text-red-500 text-sm text-center font-poppins">{errors.general}</p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 font-poppins text-sm ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg'}`}
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(13, 148, 136, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {loading ? 'Loading...' : 'Sign In'}
            </motion.button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-gray-500 bg-white rounded-full font-poppins">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center">
              <motion.button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center px-6 py-3 bg-white text-gray-900 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-md font-poppins text-sm"
                whileHover={{ scale: 1.05, boxShadow: "0 0 12px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                Sign in with Google
              </motion.button>
            </div>

            <div className="flex justify-between text-sm text-gray-600 mt-8 font-poppins">
              {role === "student" ? (
                <>
                  <Link href="/forgotpassword" className="hover:text-teal-600 hover:underline transition duration-200">Forgot Password?</Link>
                  <Link href="/signup" className="hover:text-teal-600 hover:underline transition duration-200">Register Now</Link>
                </>
              ) : (
                <>
                  <Link href="/tutor/forgotpassword" className="hover:text-teal-600 hover:underline transition duration-200">Forgot Password?</Link>
                  <Link href="/tutor/signup" className="hover:text-teal-600 hover:underline transition duration-200">Register Now</Link>
                </>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;