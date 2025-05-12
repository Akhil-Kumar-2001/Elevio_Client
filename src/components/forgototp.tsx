// 'use client';

// import React, { useState, useEffect, FormEvent } from 'react';
// import { toast } from 'react-toastify';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { forgotOtpPost as tutorForgotOtpPost, resendOtp as tutorResendOtp } from '@/app/service/tutor/tutorApi';
// import { forgotOtpPost as studentForgotOtpPost, resendOtp as studentResendOtp } from '@/app/service/user/userApi';


// interface OTPVerificationProps {
//   role: 'tutor' | 'student';
//   initialTimer?: number;
// }

// const ForgotOtpVerification: React.FC<OTPVerificationProps> = ({
//   role,
//   initialTimer = 60,
// }) => {
//   const router = useRouter();
//   const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
//   const [canResend, setCanResend] = useState<boolean>(false);
//   const [timer, setTimer] = useState<number | null>(null);
//   const [isVerifyDisabled, setIsVerifyDisabled] = useState<boolean>(false);
//   const [email, setEmail] = useState<string>('');
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const emailFromQuery = searchParams.get('email');
//     setEmail(emailFromQuery ?? '');

//     if (emailFromQuery) {
//       startTimer();
//       return;
//     }

//     const storedExpiry = localStorage.getItem('otpExpiry');
//     const now = Date.now();

//     if (storedExpiry) {
//       const expiryTime = parseInt(storedExpiry, 10);
//       const remainingTime = Math.max(0, Math.round((expiryTime - now) / 1000));

//       setTimer(remainingTime);
//       setCanResend(remainingTime === 0);
//       setIsVerifyDisabled(remainingTime === 0);
//     } else {
//       startTimer();
//     }
//   }, [searchParams]);

//   const startTimer = () => {
//     const expiryTime = Date.now() + initialTimer * 1000;
//     localStorage.setItem('otpExpiry', expiryTime.toString());
//     setTimer(initialTimer);
//     setCanResend(false);
//     setIsVerifyDisabled(false);
//   };

//   console.log(canResend)

//   useEffect(() => {
//     if (timer === null || timer <= 0) return;

//     const interval = setInterval(() => {
//       setTimer((prev) => {
//         if (prev !== null && prev > 0) {
//           const newTime = prev - 1;
//           if (newTime === 0) {
//             setCanResend(true);
//             setIsVerifyDisabled(true);
//             localStorage.removeItem('otpExpiry');
//           }
//           return newTime;
//         }
//         return 0;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [timer]);

//   const handleResend = async () => {
//     startTimer();
//     try {
//       const response = await (role == 'student' ? studentResendOtp(email) : tutorResendOtp(email));
//       if (response) {
//         toast.success('OTP resent successfully!');
//       }
//     } catch (error) {
//       console.error('Error while resending OTP:', error);
//       toast.error('Failed to resend OTP. Try again.');
//     }
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const otpString = otp.join('');

//     if (otpString.length === 6 && !isVerifyDisabled) {
//       if (!email) {
//         toast.error('Unauthorized user');
//         router.push('/signup');
//         return;
//       }

//       try {
//         const response = await (role == 'student' ? studentForgotOtpPost(otpString, email) : tutorForgotOtpPost(otpString, email));
//         if (response) {
//           toast.success(response.message);
//           // role == 'student' ? router.push(`/resetpassword?email=${response.email}`) : router.push(`/tutor/resetpassword?email=${response.email}`)
//           if(role === 'student'){
//             router.push(`/resetpassword?email=${response.email}`) 
//           }else{
//             router.push(`/tutor/resetpassword?email=${response.email}`)
//           }
//         }
//       } catch (error) {
//         console.log("error", error);
//           toast.error('Otp Verification failed')
//       }
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
//       <div className="flex w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
//         {/* Left section - Image */}
//         <div className="hidden md:flex md:w-1/2 items-center justify-center p-12">
//           <div className="w-96">
//             <img
//               src={role === 'tutor' ? '/images/TutorLogin.png' : '/images/StudentLogin.png'}
//               alt={`${role} verification`}
//               className="w-full h-auto"
//             />
//           </div>
//         </div>

//         {/* Right section - OTP form */}
//         <div className="w-full md:w-1/2 p-8">
//           <div className="h-full flex flex-col">
//             <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
//               Verification Code
//             </h2>
//             <p className="text-center text-gray-500 text-sm mb-8">
//               {`We've sent a verification code to`} {email || 'your email'}
//             </p>

//             <form onSubmit={handleSubmit} className="flex flex-col space-y-8 max-w-sm mx-auto w-full">
//               <div className="flex justify-center gap-3">
//                 {otp.map((digit, index) => (
//                   <input
//                     key={index}
//                     id={`otp-${index}`}
//                     type="text"
//                     maxLength={1}
//                     value={digit}
//                     onChange={(e) => {
//                       if (!isNaN(Number(e.target.value))) {
//                         setOtp((prev) => {
//                           const newOtp = [...prev];
//                           newOtp[index] = e.target.value;
//                           return newOtp;
//                         });

//                         const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
//                         nextInput?.focus();
//                       }
//                     }}
//                     onKeyDown={(e) => {
//                       if (e.key === 'Backspace' && !otp[index] && index > 0) {
//                         const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
//                         prevInput?.focus();
//                         setOtp((prev) => {
//                           const newOtp = [...prev];
//                           newOtp[index - 1] = '';
//                           return newOtp;
//                         });
//                       }
//                     }}
//                     className="w-12 h-12 text-center text-xl font-bold text-purple-600 border border-gray-200 
//                              rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent 
//                              outline-none transition-all bg-white hover:border-purple-200"
//                     aria-label={`Digit ${index + 1}`}
//                   />
//                 ))}
//               </div>

//               <div className="text-center">
//                 {timer === null ? (
//                   <p className="text-gray-500 text-sm">Loading...</p>
//                 ) : timer > 0 ? (
//                   <p className="text-gray-500 text-sm">
//                     Resend available in <span className="font-semibold text-purple-600">{timer}s</span>
//                   </p>
//                 ) : (
//                   <button
//                     type="button"
//                     onClick={handleResend}
//                     className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors"
//                   >
//                     Resend Code
//                   </button>
//                 )}
//               </div>

//               <button
//                 type="submit"
//                 disabled={isVerifyDisabled}
//                 className={`w-full py-3 rounded-lg font-medium transition-colors ${isVerifyDisabled
//                     ? 'bg-gray-400 cursor-not-allowed'
//                     : 'bg-purple-600 hover:bg-purple-700 text-white'
//                   }`}
//               >
//                 Verify
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotOtpVerification;








'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pencil, GraduationCap, Globe, Pen, Book, Users } from 'lucide-react';
import { motion } from 'framer-motion';

import { forgotOtpPost as tutorForgotOtpPost, resendOtp as tutorResendOtp } from '@/app/service/tutor/tutorApi';
import { forgotOtpPost as studentForgotOtpPost, resendOtp as studentResendOtp } from '@/app/service/user/userApi';

interface OTPVerificationProps {
  role: 'tutor' | 'student';
  initialTimer?: number;
}

const ForgotOtpVerification: React.FC<OTPVerificationProps> = ({
  role,
  initialTimer = 60,
}) => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [canResend, setCanResend] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(initialTimer);
  const [isVerifyDisabled, setIsVerifyDisabled] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const searchParams = useSearchParams();

  console.log(canResend)

  useEffect(() => {
    const emailFromQuery = searchParams.get('email');
    setEmail(emailFromQuery ?? '');

    if (emailFromQuery) {
      startTimer();
      return;
    }

    const storedExpiry = localStorage.getItem('otpExpiry');
    const now = Date.now();

    if (storedExpiry) {
      const expiryTime = parseInt(storedExpiry, 10);
      const remainingTime = Math.max(0, Math.round((expiryTime - now) / 1000));

      setTimer(remainingTime);
      setCanResend(remainingTime === 0);
      setIsVerifyDisabled(remainingTime === 0);
    } else {
      startTimer();
    }
  }, [searchParams]);

  const startTimer = () => {
    const expiryTime = Date.now() + initialTimer * 1000;
    localStorage.setItem('otpExpiry', expiryTime.toString());
    setTimer(initialTimer);
    setCanResend(false);
    setIsVerifyDisabled(false);
  };

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          setCanResend(true);
          setIsVerifyDisabled(true);
          localStorage.removeItem('otpExpiry');
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    startTimer();
    try {
      const response = await (role === 'student' ? studentResendOtp(email) : tutorResendOtp(email));
      if (response) {
        toast.success('OTP resent successfully!');
      }
    } catch (error) {
      console.error('Error while resending OTP:', error);
      toast.error('Failed to resend OTP. Try again.');
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    console.log(index)
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    // Validate that the pasted data is a 6-digit numeric string
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);

      // Move focus to the last input field after pasting
      const lastInput = document.getElementById(`otp-${otp.length - 1}`) as HTMLInputElement;
      if (lastInput) lastInput.focus();
    } else {
      toast.error('Please paste a valid 6-digit OTP');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }

    if (!email) {
      toast.error('Unauthorized user');
      router.push('/signup');
      return;
    }

    if (isVerifyDisabled) {
      toast.error('OTP has expired. Please resend a new OTP.');
      return;
    }

    try {
      const response = await (role === 'student' ? studentForgotOtpPost(otpString, email) : tutorForgotOtpPost(otpString, email));
      if (response) {
        toast.success(response.message);
        if (role === 'student') {
          window.history.replaceState(null, '', `/resetpassword?email=${response.email}`);
          router.push(`/resetpassword?email=${response.email}`);
        } else {
          window.history.replaceState(null, '', `/tutor/resetpassword?email=${response.email}`);
          router.push(`/tutor/resetpassword?email=${response.email}`);
        }
      }
    } catch (error) {
      console.error("OTP Verification failed:", error);
      toast.error('OTP Verification failed');
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
                    <span className="text-teal-600 font-poppins font-bold text-lg">Verify</span>
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
                    <span className="text-teal-600 font-poppins font-bold text-lg">Verify</span>
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

        {/* Right Section: OTP Form */}
        <div className="lg:w-1/2 p-8 flex flex-col justify-center bg-gradient-to-b from-white to-gray-50 overflow-y-auto">
          <motion.h2
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl font-extrabold text-center text-gray-900 mb-4 font-poppins tracking-wide"
          >
            Verification Code
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center text-gray-500 text-sm mb-6 font-poppins"
          >
            {`We've sent a verification code to`} {email || 'your email'}
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-xs mx-auto w-full">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    if (!isNaN(Number(e.target.value))) {
                      setOtp((prev) => {
                        const newOtp = [...prev];
                        newOtp[index] = e.target.value;
                        return newOtp;
                      });

                      if (index < otp.length - 1) {
                        const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
                        if (nextInput) nextInput.focus();
                      }
                    }
                  }}
                  onPaste={(e) => handlePaste(e, index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !otp[index] && index > 0) {
                      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
                      if (prevInput) {
                        prevInput.focus();
                        setOtp((prev) => {
                          const newOtp = [...prev];
                          newOtp[index - 1] = '';
                          return newOtp;
                        });
                      }
                    }
                  }}
                  className="w-10 h-10 text-center text-lg font-bold text-teal-600 border-b-2 border-gray-200 focus:border-teal-600 focus:shadow-[0_0_12px_rgba(13,148,136,0.4)] outline-none transition-all duration-300 font-poppins bg-gray-50 rounded-none"
                  aria-label={`Digit ${index + 1}`}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>

            <div className="text-center">
              {timer > 0 ? (
                <p className="text-gray-500 text-sm font-poppins">
                  Resend available in <span className="font-semibold text-teal-600">{timer}s</span>
                </p>
              ) : (
                <motion.button
                  type="button"
                  onClick={handleResend}
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors font-poppins"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Resend Code
                </motion.button>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isVerifyDisabled}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 font-poppins text-sm ${isVerifyDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg'}`}
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(13, 148, 136, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Verify
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotOtpVerification;