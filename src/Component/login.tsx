'use client';

import React, { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
import { loginValidation } from '@/app/utits/validation';
import { googleSignInApi as tutorGoogle, tutorSignin } from '@/app/service/tutor/tutorApi';
import { googleSignInApi as studentGoogle, studentSignin } from '@/app/service/user/userApi';
import { adminSignin } from '@/app/service/admin/adminApi';
import useTutorAuthStore from '@/store/tutorAuthStore';
import useStudentAuthStore from '@/store/userAuthStore';
import useAdminAuthStore from '@/store/adminAuthStore'
import { getSession, signIn } from 'next-auth/react';
import { basicType, userType } from "@/types/types";


interface LoginPageProps {
  role: 'student' | 'tutor' | 'admin';
}

const LoginPage: React.FC<LoginPageProps> = ({ role }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const studentAuth = useStudentAuthStore();
  const tutorAuth = useTutorAuthStore();
  const adminAuth = useAdminAuthStore()

  const authImage = role === 'student' ? '/images/StudentLogin.png' : '/images/TutorLogin.png';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const validationResponse = loginValidation(formData);
    if (!validationResponse.status) {
      setErrors(validationResponse.message ?? null);
      return;
    }

    setLoading(true);

    try {
      const signInApi = role === 'student' ? studentSignin : role == 'tutor' ? tutorSignin : adminSignin;
      const authStore = role === 'student' ? studentAuth : role == 'tutor' ? tutorAuth : adminAuth;

      const response = await signInApi(formData);
      role == 'student' ? localStorage.setItem('authUserCheck', response.data.accessToken) : role =='tutor' ? localStorage.setItem('authTutorCheck', response.data.accessToken) : localStorage.setItem('authAdminCheck',response.data.accessToken)
      authStore.saveUserDetails(response.data);

      toast.success(response.message);
      role == 'student' ? router.push('/home') : role == 'tutor' ? router.push('/tutor/home'): router.push('/admin/dashboard');
    } catch (error) {
      setErrors('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };



  // const handleGoogleLogin = async () => {
  //   try {
  //     const result = await signIn("google", role == 'student' ? { callbackUrl: '/home',redirect: false, } : { callbackUrl: '/tutor/home',redirect: false, });

  //     if (result?.error) {
  //       console.log(errors)
  //       console.error('Sign-in failed', result.error);
  //       toast.error('Sign in using google failed');
  //       return;
  //     }
  //     // await new Promise((resolve) => setTimeout(resolve, 500)); 

  //     const session = await getSession();
  //     console.log(session)
  //     console.log(session?.user)

  //     if (!session || !session.user) {
  //       console.error('Session or user data is missing');
  //       toast.error('Failed to retrieve session data');
  //       return;
  //     }

  //     const userData = {
  //       username: session.user.name ?? '',
  //       email: session.user.email ?? '',
  //       image: session.user.image ?? '',
  //     };
  //     console.log('user data',userData);
  //     const authStore = role === 'student' ? studentAuth : tutorAuth;
  //     console.log("Before calling googleSignInApi");

  //     const googleApi = role == 'student' ? studentGoogle : tutorGoogle
  //     const response = await googleApi(userData);
  //     role == 'student' ? localStorage.setItem('authUserCheck', response.data.accessToken) : localStorage.setItem('authTutorCheck', response.data.accessToken)
  //     authStore.saveUserDetails(response.data);
  //     toast.success(response.message);
  //     role == 'student' ? router.push('/home') : router.push('/tutor/home');

  //   } catch (error: any) {
  //     console.log(error)
  //     toast.error(error)
  //   }
  // };

  const handleGoogleLogin = async () => {
    try {
      // Step 1: Redirect to Google Sign-in (this does NOT return session immediately)
      const result = await signIn("google", role == 'student' ? { callbackUrl: '/home',redirect: false, } : { callbackUrl: '/tutor/home',redirect: false, });
  
      if (result?.error) {
        console.error("Sign-in failed", result.error);
        toast.error("Sign in using Google failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error during Google Sign-in");
    }
  };
  
  // Step 2: Use useEffect to check session change and make backend call
  useEffect(() => {
    const checkSessionAndCallBackend = async () => {
      const session = await getSession();
      if (!session || !session.user) return; // If session is not available, do nothing
  
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
        role == "student"
          ? localStorage.setItem("authUserCheck", response.data.accessToken)
          : localStorage.setItem("authTutorCheck", response.data.accessToken);
  
        authStore.saveUserDetails(response.data);
        toast.success(response.message, { toastId: "google-signin-success" });
        router.push(role == "student" ? "/home" : "/tutor/home");
      } catch (error) {
        console.error(error);
        toast.error("Google authentication failed.");
      }
    };
  
    checkSessionAndCallBackend();
  }, []); // Runs when session changes


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="flex w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-12">
          <img
            src={authImage}
            alt={role === 'student' ? "Student studying" : "Tutor teaching"}
            className="w-full h-auto"
          />
        </div>

        <div className="w-full md:w-1/2 p-8">
          <div className="h-full flex flex-col">
            <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
            {role === 'student' ? 'Student Sign In' : role === 'tutor' ? 'Tutor Sign In' : 'Admin Sign In'}
            </h2>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6 max-w-sm mx-auto w-full">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-black"
              />

              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-black pr-12"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 p-1  text-gray-600 hover:text-gray-800 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 stroke-[1.5]" />
                  ) : (
                    <Eye className="w-5 h-5 stroke-[1.5]" />
                  )}
                </button>
              </div>

              {errors && <p className="text-red-500 text-sm text-center">{errors}</p>}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
              >
                {loading ? 'Loading...' : 'Sign in'}
              </button>

              {role !== 'admin' && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 text-gray-500 bg-white">Or continue with</span>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="w-12 h-12 rounded-full flex items-center justify-center bg-white border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                      </svg>
                    </button>
                  </div>
                </>
              )}

              <div className="flex justify-between text-sm text-gray-500 mt-8">
                {role === "student" ? (
                  <>
                    <a href="/forgotpassword" className="hover:text-purple-600 hover:underline">Forgot password?</a>
                    <a href="/signup" className="hover:text-purple-600 hover:underline">Register now</a>
                  </>
                ) : role == "tutor" ? (
                  <>
                    <a href="/tutor/forgotpassword" className="hover:text-purple-600 hover:underline">Forgot password?</a>
                    <a href="/tutor/signup" className="hover:text-purple-600 hover:underline">Register now</a>
                  </>
                ) : <></>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;