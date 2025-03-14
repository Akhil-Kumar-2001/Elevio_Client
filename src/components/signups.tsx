
// 'use client';

// import React, { useState,useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';
// import { signupValidation } from '../app/utits/validation';
// import { googleSignInApi as studentGoogle,userSignup } from '@/app/service/user/userApi';
// import { googleSignInApi as tutorGoogle,tutorSignup } from '@/app/service/tutor/tutorApi';
// import { FcGoogle } from 'react-icons/fc';
// import { getSession, signIn } from 'next-auth/react';
// import useTutorAuthStore from '@/store/tutorAuthStore';
// import useStudentAuthStore from '@/store/userAuthStore';

// interface SignupFormProps {
//   role: 'student' | 'tutor';
// }

// const SignupForm: React.FC<SignupFormProps> = ({ role }) => {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const router = useRouter();

//   const studentAuth = useStudentAuthStore();
//   const tutorAuth = useTutorAuthStore();

//   const [errors, setErrors] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   const imageSrc = role === 'student' ? '/images/StudentLogin.png' : '/images/TutorLogin.png';

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setErrors(null);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (loading) return;

//     const validationResponse = signupValidation(formData);
//     if (!validationResponse.status) {
//       setErrors(validationResponse.message ?? null);
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setErrors('Passwords do not match');
//       return;
//     }

//     setLoading(true);
//     try {
//       const signUpApi = role === 'student' ? userSignup : tutorSignup;
//       const response = await signUpApi(formData);
//       toast.success(response.message);
//       role === 'student' ? router.push(`/otp?email=${response.email}`) : router.push(`/tutor/otp?email=${response.email}`);
//     } catch (error) {
//       setErrors('Signup failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

// //   const handleGoogleSignIn = async () => {
// //     try {
// //       const result = await signIn("google", role == 'student' ? { callbackUrl: '/home' } : { callbackUrl: '/tutor/home' });

// //       if (result?.error) {
// //         console.log(errors)
// //         console.error('Sign-in failed', result.error);
// //         toast.error('Sign in using google failed');
// //         return;
// //       }

// //       const session = await getSession();
// //       console.log(session?.user)

// //       if (!session || !session.user) {
// //         console.error('Session or user data is missing');
// //         toast.error('Failed to retrieve session data');
// //         return;
// //       }

// //       const userData = {
// //         username: session.user.name ?? '',
// //         email: session.user.email ?? '',
// //         image: session.user.image ?? '',
// //       };
// //       const authStore = role === 'student' ? studentAuth : tutorAuth;
// //       console.log("Before calling googleSignInApi");

// //       const googleApi = role == 'student' ? studentGoogle : tutorGoogle
// //       const response = await googleApi(userData);
// //       role == 'student' ? localStorage.setItem('authUserCheck', response.data.accessToken) : localStorage.setItem('authTutorCheck', response.data.accessToken)
// //       authStore.saveUserDetails(response.data);
// //       toast.success(response.message);
// //       role == 'student' ? router.push('/home') : router.push('/tutor/home');

// //     } catch (error: any) {
// //       console.log(error)
// //       toast.error(error)
// //     }
// // };

// const handleGoogleSignIn = async () => {
//   try {
//     // Step 1: Redirect to Google Sign-in (this does NOT return session immediately)
//     const result = await signIn("google", role == 'student' ? { callbackUrl: '/home',redirect: false, } : { callbackUrl: '/tutor/dashboard',redirect: false, });

//     if (result?.error) {
//       console.error("Sign-in failed", result.error);
//       toast.error("Sign in using Google failed");
//     }
//   } catch (error) {
//     console.error(error);
//     toast.error("Error during Google Sign-in");
//   }
// };

// // Step 2: Use useEffect to check session change and make backend call
// useEffect(() => {
//   const checkSessionAndCallBackend = async () => {
//     const session = await getSession();
//     if (!session || !session.user) return; // If session is not available, do nothing

//     console.log("Session found, calling backend...");
    
//     const userData = {
//       username: session.user.name ?? "",
//       email: session.user.email ?? "",
//       image: session.user.image ?? "",
//     };

//     const googleApi = role == "student" ? studentGoogle : tutorGoogle;
//     const authStore = role === "student" ? studentAuth : tutorAuth;

//     try {
//       const response = await googleApi(userData);
//       // role == "student"
//       //   ? localStorage.setItem("authUserCheck", response.data.accessToken)
//       //   : localStorage.setItem("authTutorCheck", response.data.accessToken);

//       authStore.saveUserDetails(response.data);
//       toast.success(response.message, { toastId: "google-signin-success" });
//       router.push(role == "student" ? "/home" : "/tutor/dashboard");
//     } catch (error) {
//       console.error(error);
//       toast.error("Google authentication failed.");
//     }
//   };

//   checkSessionAndCallBackend();
// }, []); // Runs when session changes


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
//             <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">Sign Up as {role === 'tutor' ? 'Tutor' : 'Student'}</h2>

//             <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6 max-w-sm mx-auto w-full">
//               <div className="flex-1 space-y-6">
//                 <input
//                   type="text"
//                   name="username"
//                   placeholder="Full Name"
//                   value={formData.username}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-black"
//                 />
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-black"
//                 />
//                 <input
//                   type="password"
//                   name="password"
//                   placeholder="Password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-black"
//                 />
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   placeholder="Confirm Password"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-black"
//                 />

//                 {errors && (
//                   <p className="text-red-500 text-sm text-center">{errors}</p>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className={`w-full py-3 rounded-lg font-medium transition-colors ${
//                     loading 
//                       ? 'bg-gray-400 cursor-not-allowed' 
//                       : 'bg-purple-600 hover:bg-purple-700 text-white'
//                   }`}
//                 >
//                   {loading ? 'Loading...' : 'Sign Up'}
//                 </button>
//               </div>

//                 <button 
//                   type="button" 
//                   onClick={handleGoogleSignIn} 
//                   className="w-full flex items-center justify-center gap-2 py-2 mt-3   rounded-lg text-gray-500 hover:bg-gray-100 transition-all"
//                 >
//                   <FcGoogle size={32} />
//                   Sign Up with Google
//                 </button>

//               <div className="text-center text-sm text-gray-500 mt-6">
//                 <a href={role === 'tutor' ? '/tutor/login' : '/login'} className="hover:text-purple-600 hover:underline">
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

