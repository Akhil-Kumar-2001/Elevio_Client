// 'use client';

// import React, { useState } from 'react';
// import { signupValidation } from '../../utits/validation';
// import { userSignup } from '@/app/service/user/userApi';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';

// const SignupPage = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const router = useRouter();
//   const [errors, setErrors] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

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
//       const response = await userSignup(formData);
//       toast.success(response.message);
//       router.push(`/otp?email=${response.email}`);
//     } catch (error) {
//       // Handle error
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
//       <div className="flex w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
//         {/* Left section - Image */}
//         <div className="hidden md:flex md:w-1/2 items-center justify-center p-12">
//           <div className="w-96">
//             <img 
//               src="/images/StudentLogin.png" 
//               alt="Student signing up" 
//               className="w-full h-auto"
//             />
//           </div>
//         </div>

//         {/* Right section - Signup form */}
//         <div className="w-full md:w-1/2 p-8">
//           <div className="h-full flex flex-col">
//             <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">Sign Up</h2>

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

//               <div className="text-center text-sm text-gray-500 mt-6">
//                 <a href="/login" className="hover:text-purple-600 hover:underline">
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

// export default SignupPage;

import SignupForm from "@/components/signup";

const StudentSignUp = () =>{
      return <SignupForm role = "student" />
}

export default StudentSignUp