// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';
// import { FcGoogle } from 'react-icons/fc';
// import { Eye, EyeOff } from 'lucide-react'; // Add this import
// import { getSession, signIn } from 'next-auth/react';

// import { validateSignupForm, SignupFormData } from '../app/utils/validationzod';
// import { googleSignInApi as studentGoogle, userSignup } from '@/app/service/user/userApi';
// import { googleSignInApi as tutorGoogle, tutorSignup } from '@/app/service/tutor/tutorApi';
// import useTutorAuthStore from '@/store/tutorAuthStore';
// import useStudentAuthStore from '@/store/userAuthStore';

// interface SignupFormProps {
//   role: 'student' | 'tutor';
// }

// const SignupForm: React.FC<SignupFormProps> = ({ role }) => {
//   const [formData, setFormData] = useState<SignupFormData>({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [loading, setLoading] = useState<boolean>(false);
//   const [showPassword, setShowPassword] = useState(false); // Add state for password visibility
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Add state for confirm password visibility

//   const router = useRouter();
//   const studentAuth = useStudentAuthStore();
//   const tutorAuth = useTutorAuthStore();

//   const imageSrc = role === 'student' ? '/images/StudentLogin.png' : '/images/TutorLogin.png';

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));

//     if (errors[name]) {
//       setErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors[name];
//         return newErrors;
//       });
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (loading) return;

//     const validationResponse = validateSignupForm(formData);
//     if (!validationResponse.status) {
//       setErrors(validationResponse.errors);
//       return;
//     }

//     setLoading(true);
//     try {
//       const signUpApi = role === 'student' ? userSignup : tutorSignup;
//       const response = await signUpApi(formData);
//       toast.success(response.message);
//       // role === 'student'
//       //   ? router.push(`/otp?email=${response.email}`)
//       //   : router.push(`/tutor/otp?email=${response.email}`);
//       if (role === 'student') {
//         router.push(`/otp?email=${response.email}`)
//       } else {
//         router.push(`/tutor/otp?email=${response.email}`)
//       }
//     } catch (error) {
//       console.log(error)
//       setErrors({ general: 'Signup failed. Please try again.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       const result = await signIn("google", role == 'student'
//         ? { callbackUrl: '/home', redirect: false }
//         : { callbackUrl: '/tutor/dashboard', redirect: false }
//       );

//       if (result?.error) {
//         console.error("Sign-in failed", result.error);
//         toast.error("Sign in using Google failed");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Error during Google Sign-in");
//     }
//   };

//   useEffect(() => {
//     const checkSessionAndCallBackend = async () => {
//       const session = await getSession();
//       if (!session || !session.user) return;

//       console.log("Session found, calling backend...");

//       const userData = {
//         username: session.user.name ?? "",
//         email: session.user.email ?? "",
//         image: session.user.image ?? "",
//       };

//       const googleApi = role == "student" ? studentGoogle : tutorGoogle;
//       const authStore = role === "student" ? studentAuth : tutorAuth;

//       try {
//         const response = await googleApi(userData);
//         authStore.saveUserDetails(response.data);
//         toast.success(response.message, { toastId: "google-signin-success" });
//         router.push(role == "student" ? "/home" : "/tutor/dashboard");
//       } catch (error) {
//         console.error(error);
//         toast.error("Google authentication failed.");
//       }
//     };

//     checkSessionAndCallBackend();
//   }, []);

//   // Add toggle functions
//   const togglePasswordVisibility = () => setShowPassword(!showPassword);
//   const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 overflow-hidden">
//       <div className="flex w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
//         {/* Left section - Image */}
//         <div className="hidden md:flex md:w-1/2 items-center justify-center p-12">
//           <div className="w-96">
//             <img
//               src={imageSrc}
//               alt={`${role === 'student' ? "Student studying" : "Tutor teaching"} signing up`}
//               className="w-full h-auto"
//             />
//           </div>
//         </div>

//         {/* Right section - Signup form */}
//         <div className="w-full md:w-1/2 p-8">
//           <div className="h-full flex flex-col">
//             <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
//               Sign Up as {role === 'tutor' ? 'Tutor' : 'Student'}
//             </h2>

//             <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6 max-w-sm mx-auto w-full">
//               <div className="flex-1 space-y-6">
//                 {/* Username Input */}
//                 <div>
//                   <input
//                     type="text"
//                     name="username"
//                     placeholder="Full Name"
//                     value={formData.username}
//                     onChange={handleChange}
//                     className={`w-full px-4 py-3 border ${errors.username
//                         ? 'border-red-500'
//                         : 'border-gray-200'
//                       } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-black`}
//                   />
//                   {errors.username && (
//                     <p className="text-red-500 text-sm mt-1">{errors.username}</p>
//                   )}
//                 </div>

//                 {/* Email Input */}
//                 <div>
//                   <input
//                     type="email"
//                     name="email"
//                     placeholder="Email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className={`w-full px-4 py-3 border ${errors.email
//                         ? 'border-red-500'
//                         : 'border-gray-200'
//                       } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-black`}
//                   />
//                   {errors.email && (
//                     <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//                   )}
//                 </div>

//                 {/* Password Input */}
//                 <div className="relative flex items-center">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     placeholder="Password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className={`w-full px-4 py-3 border ${errors.password
//                         ? 'border-red-500'
//                         : 'border-gray-200'
//                       } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-black pr-12`}
//                   />
//                   <button
//                     type="button"
//                     onClick={togglePasswordVisibility}
//                     className="absolute right-4 p-1 text-gray-600 hover:text-gray-800 focus:outline-none"
//                     aria-label={showPassword ? "Hide password" : "Show password"}
//                   >
//                     {showPassword ? (
//                       <EyeOff className="w-5 h-5 stroke-[1.5]" />
//                     ) : (
//                       <Eye className="w-5 h-5 stroke-[1.5]" />
//                     )}
//                   </button>
//                   {errors.password && (
//                     <p className="text-red-500 text-sm mt-1">{errors.password}</p>
//                   )}
//                 </div>

//                 {/* Confirm Password Input */}
//                 <div className="relative flex items-center">
//                   <input
//                     type={showConfirmPassword ? "text" : "password"}
//                     name="confirmPassword"
//                     placeholder="Confirm Password"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     className={`w-full px-4 py-3 border ${errors.confirmPassword
//                         ? 'border-red-500'
//                         : 'border-gray-200'
//                       } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-black pr-12`}
//                   />
//                   <button
//                     type="button"
//                     onClick={toggleConfirmPasswordVisibility}
//                     className="absolute right-4 p-1 text-gray-600 hover:text-gray-800 focus:outline-none"
//                     aria-label={showConfirmPassword ? "Hide password" : "Show password"}
//                   >
//                     {showConfirmPassword ? (
//                       <EyeOff className="w-5 h-5 stroke-[1.5]" />
//                     ) : (
//                       <Eye className="w-5 h-5 stroke-[1.5]" />
//                     )}
//                   </button>
//                   {errors.confirmPassword && (
//                     <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
//                   )}
//                 </div>

//                 {/* General Error Message */}
//                 {errors.general && (
//                   <p className="text-red-500 text-sm text-center">{errors.general}</p>
//                 )}

//                 {/* Submit Button */}
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className={`w-full py-3 rounded-lg font-medium transition-colors ${loading
//                       ? 'bg-gray-400 cursor-not-allowed'
//                       : 'bg-purple-600 hover:bg-purple-700 text-white'
//                     }`}
//                 >
//                   {loading ? 'Loading...' : 'Sign Up'}
//                 </button>
//               </div>

//               {/* Google Sign-In Button */}
//               <button
//                 type="button"
//                 onClick={handleGoogleSignIn}
//                 className="w-full flex items-center justify-center gap-2 py-2 mt-3 rounded-lg text-gray-500 hover:bg-gray-100 transition-all"
//               >
//                 <FcGoogle size={32} />
//                 Sign Up with Google
//               </button>

//               {/* Login Link */}
//               <div className="text-center text-sm text-gray-500 mt-6">
//                 <a
//                   href={role === 'tutor' ? '/tutor/login' : '/login'}
//                   className="hover:text-purple-600 hover:underline"
//                 >
//                   Already have an account? Sign in
//                 </a>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignupForm;





'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Pencil, GraduationCap, Globe, Pen, Book, Users } from 'lucide-react';
import { getSession, signIn } from 'next-auth/react';
import { motion } from 'framer-motion';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const studentAuth = useStudentAuthStore();
  const tutorAuth = useTutorAuthStore();

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

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

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
      if (role === 'student') {
        window.history.replaceState(null, '', `/otp?email=${response.email}`);
        router.push(`/otp?email=${response.email}`);
      } else {
        window.history.replaceState(null, '', `/tutor/otp?email=${response.email}`);
        router.push(`/tutor/otp?email=${response.email}`);
      }
    } catch (error) {
      console.log(error);
      setErrors({ general: 'Signup failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn('google', role === 'student'
        ? { callbackUrl: '/home', redirect: false }
        : { callbackUrl: '/tutor/dashboard', redirect: false }
      );

      if (result?.error) {
        console.error('Sign-in failed', result.error);
        toast.error('Sign in using Google failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error during Google Sign-in');
    }
  };

  useEffect(() => {
    const checkSessionAndCallBackend = async () => {
      const session = await getSession();
      if (!session || !session.user) return;

      console.log('Session found, calling backend...');

      const userData = {
        username: session.user.name ?? '',
        email: session.user.email ?? '',
        image: session.user.image ?? '',
      };

      const googleApi = role === 'student' ? studentGoogle : tutorGoogle;
      const authStore = role === 'student' ? studentAuth : tutorAuth;

      try {
        const response = await googleApi(userData);
        authStore.saveUserDetails(response.data);
        toast.success(response.message, { toastId: 'google-signin-success' });
        if (role === 'student') {
          window.history.replaceState(null, '', '/home');
          router.replace('/home');
        } else {
          window.history.replaceState(null, '', '/tutor/dashboard');
          router.replace('/tutor/dashboard');
        }
      } catch (error) {
        console.error(error);
        toast.error('Google authentication failed.');
      }
    };

    checkSessionAndCallBackend();
  }, [role, router, studentAuth, tutorAuth]);

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
                    <span className="text-teal-600 font-poppins font-bold text-lg">Join</span>
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
                    <span className="text-teal-600 font-poppins font-bold text-lg">Join</span>
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

        {/* Right Section: Signup Form */}
        <div className="lg:w-1/2 p-8 flex flex-col justify-center bg-gradient-to-b from-white to-gray-50 overflow-y-auto">
          <motion.h2
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl font-extrabold text-center text-gray-900 mb-6 font-poppins tracking-wide"
          >
            {role === 'student' ? 'Student Sign Up' : 'Tutor Sign Up'}
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-xs mx-auto w-full">
            <div className="relative">
              <motion.input
                type="text"
                name="username"
                placeholder="Full Name"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-50 text-gray-900 placeholder-gray-400 border-b-2 ${errors.username ? 'border-red-500' : 'border-gray-200 focus:border-teal-600'} focus:shadow-[0_0_12px_rgba(13,148,136,0.4)] outline-none transition-all duration-300 font-poppins text-sm`}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1 font-poppins">{errors.username}</p>
              )}
            </div>

            <div className="relative">
              <motion.input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-50 text-gray-900 placeholder-gray-400 border-b-2 ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-teal-600'} focus:shadow-[0_0_12px_rgba(13,148,136,0.4)] outline-none transition-all duration-300 font-poppins text-sm`}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 font-poppins">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <motion.input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-50 text-gray-900 placeholder-gray-400 border-b-2 ${errors.password ? 'border-red-500' : 'border-gray-200 focus:border-teal-600'} focus:shadow-[0_0_12px_rgba(13,148,136,0.4)] outline-none transition-all duration-300 font-poppins text-sm pr-10`}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
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
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 font-poppins">{errors.password}</p>
              )}
            </div>

            <div className="relative">
              <motion.input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-50 text-gray-900 placeholder-gray-400 border-b-2 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200 focus:border-teal-600'} focus:shadow-[0_0_12px_rgba(13,148,136,0.4)] outline-none transition-all duration-300 font-poppins text-sm pr-10`}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
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
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 font-poppins">{errors.confirmPassword}</p>
              )}
            </div>

            {errors.general && (
              <p className="text-red-500 text-sm text-center font-poppins">{errors.general}</p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 font-poppins text-sm ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg'}`}
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(13, 148, 136, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {loading ? 'Loading...' : 'Sign Up'}
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
                onClick={handleGoogleSignIn}
                className="flex items-center px-5 py-2 bg-white text-gray-900 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-md font-poppins text-sm"
                whileHover={{ scale: 1.05, boxShadow: '0 0 12px rgba(0, 0, 0, 0.1)' }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                Sign up with Google
              </motion.button>
            </div>

            <div className="flex justify-center text-sm text-gray-600 mt-4 font-poppins">
              <a
                href={role === 'tutor' ? '/tutor/login' : '/login'}
                className="hover:text-teal-600 hover:underline transition duration-200"
              >
                Already have an account? Sign in
              </a>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupForm;