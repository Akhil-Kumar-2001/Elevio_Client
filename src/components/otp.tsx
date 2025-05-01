'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';
import { otpPost as tutorOtpPost, resendOtp as tutorResendOtp } from '@/app/service/tutor/tutorApi';
import { otpPost as studentOtpPost, resendOtp as studentResendOtp } from '@/app/service/user/userApi';


interface OTPVerificationProps {
  role: 'tutor' | 'student';
  initialTimer?: number;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  role,
  initialTimer = 60,
}) => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [canResend, setCanResend] = useState<boolean>(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [isVerifyDisabled, setIsVerifyDisabled] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const searchParams = useSearchParams();

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
    if (timer === null || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev !== null && prev > 0) {
          const newTime = prev - 1;
          if (newTime === 0) {
            setCanResend(true);
            setIsVerifyDisabled(true);
            localStorage.removeItem('otpExpiry');
          }
          return newTime;
        }
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  console.log(canResend)

  const handleResend = async () => {
    startTimer();
    try {
      const response = await (role == 'student' ? studentResendOtp(email) : tutorResendOtp(email));
      if (response) {
        toast.success('OTP resent successfully!');
      }
    } catch (error) {
      console.error('Error while resending OTP:', error);
      toast.error('Failed to resend OTP. Try again.');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length === 6 && !isVerifyDisabled) {
      if (!email) {
        toast.error('Unauthorized user');
        router.push('/signup');
        return;
      }

      try {
        const response = await (role == 'student' ? studentOtpPost(otpString, email) : tutorOtpPost(otpString, email));
        if (response) {
          // toast.success('OTP Verified Successfully');
          toast.success(response.message);
          if (role === 'student') {
            router.push('/login');
          } else {
            router.push('/tutor/login');
          }
        }
      } catch (error) {
        console.log(error)
        toast.error('Otp Verification failed')
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="flex w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Left section - Image */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-12">
          <div className="w-96">
            <img
              src={role === 'tutor' ? '/images/TutorLogin.png' : '/images/StudentLogin.png'}
              alt={`${role} verification`}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Right section - OTP form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="h-full flex flex-col">
            <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
              Verification Code
            </h2>
            <p className="text-center text-gray-500 text-sm mb-8">
              {`We've sent a verification code to`} {email || 'your email'}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-8 max-w-sm mx-auto w-full">
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
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

                        const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
                        nextInput?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otp[index] && index > 0) {
                        const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
                        prevInput?.focus();
                        setOtp((prev) => {
                          const newOtp = [...prev];
                          newOtp[index - 1] = '';
                          return newOtp;
                        });
                      }
                    }}
                    className="w-12 h-12 text-center text-xl font-bold text-purple-600 border border-gray-200 
                             rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                             outline-none transition-all bg-white hover:border-purple-200"
                    aria-label={`Digit ${index + 1}`}
                  />
                ))}
              </div>

              <div className="text-center">
                {timer === null ? (
                  <p className="text-gray-500 text-sm">Loading...</p>
                ) : timer > 0 ? (
                  <p className="text-gray-500 text-sm">
                    Resend available in <span className="font-semibold text-purple-600">{timer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isVerifyDisabled}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${isVerifyDisabled
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
              >
                Verify
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
