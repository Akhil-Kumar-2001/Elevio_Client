// 'use client';

// import React, { useState,useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';
// import { loginValidation } from '@/app/utits/validation';
// import { tutorSignin } from '@/app/service/tutor/tutorApi';
// import useAuthStore from '@/store/tutorAuthStore';

// const LoginPage = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });

//   const router = useRouter();
//   const [errors, setErrors] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   const  {isAuthenticated}  = useAuthStore();
//   const tokenCheck = localStorage.getItem('authTutorCheck')

//   // useEffect(()=>{
//   //   if(tokenCheck){
//   //     router.push('/tutor/home')
//   //   }
//   // },[isAuthenticated])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setErrors(null);
//   };

 

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (loading) return;

//     const validationResponse = loginValidation(formData)
//     if (!validationResponse.status) {
//       setErrors(validationResponse.message ?? null);
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await tutorSignin(formData);
//       console.log("login response",response.data)
//       //this line is for storing tutor accesstoken for authentication
//       localStorage.setItem('authTutorCheck',response.data.accessToken)
//       useAuthStore.getState().saveUserDetails(response.data)
//       toast.success(response.message);
//       router.push(`/tutor/home`);
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : 'Login failed');
//       setErrors('Invalid email or password');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     try {
//       // Implement Google login logic here
//       toast.info('Google login feature coming soon!');
//     } catch (error) {
//       toast.error('Google login failed');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
//       <div className="flex w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
//         {/* Left section - Image */}
//         <div className="hidden md:flex md:w-1/2 items-center justify-center p-12">
//           <div className="w-96">
//             <img 
//               src="/images/TutorLogin.png"
//               alt="Student studying"
//               className="w-full h-auto"
//             />
//           </div>
//         </div>
        
//         {/* Right section - Login form */}
//         <div className="w-full md:w-1/2 p-8">
//           <div className="h-full flex flex-col">
//             <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">Sign In</h2>
            
//             <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6 max-w-sm mx-auto w-full">
//               <div className="flex-1 space-y-6">
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
//                   {loading ? 'Loading...' : 'Sign in'}
//                 </button>
                
//                 <div className="relative">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t border-gray-200"></div>
//                   </div>
//                   <div className="relative flex justify-center text-sm">
//                     <span className="px-4 text-gray-500 bg-white">Or continue with</span>
//                   </div>
//                 </div>
                
//                 <div className="flex justify-center">
//                   <button
//                     type="button"
//                     onClick={handleGoogleLogin}
//                     className="w-12 h-12 rounded-full flex items-center justify-center bg-white border border-gray-200 hover:border-gray-300 transition-colors"
//                   >
//                     <svg className="w-6 h-6" viewBox="0 0 48 48">
//                       <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
//                       <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
//                       <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
//                       <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
//                     </svg>
//                   </button>
//                 </div>
//               </div>
              
//               <div className="flex justify-between text-sm text-gray-500 mt-8">
//                 <a href="/forgot-password" className="hover:text-purple-600 hover:underline">
//                   Forgot password?
//                 </a>
//                 <a href="/tutor/signup" className="hover:text-purple-600 hover:underline">
//                   Register now
//                 </a>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

import LoginPage from '@/components/login';

const TutorLogin = () => {
  return <LoginPage role="tutor" />;
};

export default TutorLogin;
