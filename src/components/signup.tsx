'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FcGoogle } from 'react-icons/fc';
import { Eye, EyeOff } from 'lucide-react'; // Add this import
import { getSession, signIn } from 'next-auth/react';

import { validateSignupForm, SignupFormData } from '../app/utils/validationzod';
import { googleSignInApi as studentGoogle, userSignup } from '@/app/service/user/userApi';
import { googleSignInApi as tutorGoogle, tutorSignup } from '@/app/service/tutor/tutorApi';
import useTutorAuthStore from '@/store/tutorAuthStore';
import useStudentAuthStore from '@/store/userAuthStore';

interface SignupFormProps {
  role: 'student' | 'tutor';
}

const SignupForm: React.FC<SignupFormProps> = ({ role }) => {
  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false); // Add state for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Add state for confirm password visibility

  const router = useRouter();
  const studentAuth = useStudentAuthStore();
  const tutorAuth = useTutorAuthStore();

  const imageSrc = role === 'student' ? '/images/StudentLogin.png' : '/images/TutorLogin.png';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const validationResponse = validateSignupForm(formData);
    if (!validationResponse.status) {
      setErrors(validationResponse.errors);
      return;
    }

    setLoading(true);
    try {
      const signUpApi = role === 'student' ? userSignup : tutorSignup;
      const response = await signUpApi(formData);
      toast.success(response.message);
      role === 'student' 
        ? router.push(`/otp?email=${response.email}`) 
        : router.push(`/tutor/otp?email=${response.email}`);
    } catch (error) {
      console.log(error)
      setErrors({ general: 'Signup failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn("google", role == 'student' 
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

      const googleApi = role == "student" ? studentGoogle : tutorGoogle;
      const authStore = role === "student" ? studentAuth : tutorAuth;

      try {
        const response = await googleApi(userData);
        authStore.saveUserDetails(response.data);
        toast.success(response.message, { toastId: "google-signin-success" });
        router.push(role == "student" ? "/home" : "/tutor/dashboard");
      } catch (error) {
        console.error(error);
        toast.error("Google authentication failed.");
      }
    };

    checkSessionAndCallBackend();
  }, []);

  // Add toggle functions
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 overflow-hidden">
      <div className="flex w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Left section - Image */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-12">
          <div className="w-96">
            <img 
              src={imageSrc} 
              alt={`${role === 'student' ? "Student studying" : "Tutor teaching"} signing up`} 
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Right section - Signup form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="h-full flex flex-col">
            <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
              Sign Up as {role === 'tutor' ? 'Tutor' : 'Student'}
            </h2>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6 max-w-sm mx-auto w-full">
              <div className="flex-1 space-y-6">
                {/* Username Input */}
                <div>
                  <input
                    type="text"
                    name="username"
                    placeholder="Full Name"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.username 
                        ? 'border-red-500' 
                        : 'border-gray-200'
                    } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-black`}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.email 
                        ? 'border-red-500' 
                        : 'border-gray-200'
                    } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-black`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password Input */}
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.password 
                        ? 'border-red-500' 
                        : 'border-gray-200'
                    } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-black pr-12`}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 p-1 text-gray-600 hover:text-gray-800 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 stroke-[1.5]" />
                    ) : (
                      <Eye className="w-5 h-5 stroke-[1.5]" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="relative flex items-center">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.confirmPassword 
                        ? 'border-red-500' 
                        : 'border-gray-200'
                    } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-black pr-12`}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-4 p-1 text-gray-600 hover:text-gray-800 focus:outline-none"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5 stroke-[1.5]" />
                    ) : (
                      <Eye className="w-5 h-5 stroke-[1.5]" />
                    )}
                  </button>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* General Error Message */}
                {errors.general && (
                  <p className="text-red-500 text-sm text-center">{errors.general}</p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {loading ? 'Loading...' : 'Sign Up'}
                </button>
              </div>

              {/* Google Sign-In Button */}
              <button 
                type="button" 
                onClick={handleGoogleSignIn} 
                className="w-full flex items-center justify-center gap-2 py-2 mt-3 rounded-lg text-gray-500 hover:bg-gray-100 transition-all"
              >
                <FcGoogle size={32} />
                Sign Up with Google
              </button>

              {/* Login Link */}
              <div className="text-center text-sm text-gray-500 mt-6">
                <a 
                  href={role === 'tutor' ? '/tutor/login' : '/login'} 
                  className="hover:text-purple-600 hover:underline"
                >
                  Already have an account? Sign in
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;