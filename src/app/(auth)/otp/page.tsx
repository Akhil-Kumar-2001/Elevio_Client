'use client';

import React, { useState, useEffect, ChangeEvent, KeyboardEvent, FormEvent } from 'react';

interface OTPVerificationProps {
  onVerify?: (otp: string) => void;
  onResend?: () => void;
  initialTimer?: number;
  email?: string;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  onVerify,
  onResend,
  initialTimer = 30,
  email = ''
}) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [canResend, setCanResend] = useState<boolean>(false);

  // Initialize timer from localStorage or use initialTimer
  const [timer, setTimer] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const storedExpiry = localStorage.getItem('otpExpiry');
      if (storedExpiry) {
        const expiryTime = parseInt(storedExpiry);
        const now = new Date().getTime();
        const remainingTime = Math.round((expiryTime - now) / 1000);
        return remainingTime > 0 ? remainingTime : 0;
      }
    }
    return initialTimer;
  });

  useEffect(() => {
    // Set expiry time in localStorage when timer starts
    if (timer === initialTimer) {
      const expiryTime = new Date().getTime() + initialTimer * 1000;
      localStorage.setItem('otpExpiry', expiryTime.toString());
    }

    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const newValue = prev - 1;
          if (newValue === 0) {
            // Clear localStorage when timer reaches 0
            localStorage.removeItem('otpExpiry');
            setCanResend(true);
          }
          return newValue;
        });
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer, initialTimer]);

  const handleChange = (index: number, value: string): void => {
    if (isNaN(Number(value))) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleResend = (): void => {
    setTimer(initialTimer);
    setCanResend(false);
    const expiryTime = new Date().getTime() + initialTimer * 1000;
    localStorage.setItem('otpExpiry', expiryTime.toString());
    onResend?.();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const otpString = otp.join('');
    onVerify?.(otpString);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="flex w-full max-w-2xl mx-4">
        {/* Left section - Image */}
        <div className="flex-1 flex items-center justify-center p-6 bg-white rounded-l-xl shadow-lg">
          <div className="w-60">
            <img 
              src="/images/StudentLogin.png"
              alt="Student verification"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Right section - OTP form */}
        <div className="flex-1 p-6 bg-white rounded-r-xl shadow-lg">
          <div className="h-full flex flex-col">
            <h2 className="text-xl font-semibold text-center mt-4 mb-2 text-gray-800">Verification Code</h2>
            <p className="text-center text-gray-500 text-sm mb-6">
              We've sent a verification code to {email || 'mail'}
            </p>
            
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6 max-w-sm mx-auto">
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => 
                      handleChange(index, e.target.value)}
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => 
                      handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-bold text-purple-600 border border-gray-200 
                             rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                             outline-none transition-all bg-white hover:border-purple-200"
                    aria-label={`Digit ${index + 1}`}
                  />
                ))}
              </div>

              <div className="text-center">
                {timer > 0 ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 text-sm">
                      Resend available in <span className="font-semibold text-purple-600">{timer}s</span>
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium 
                             transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Resend Code
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg 
                         text-sm font-medium transition-colors"
              >
                Verify
              </button>

              {/* <div className="text-center mt-4">
                <a href="#" className="text-xs text-gray-500 hover:text-purple-600 hover:underline">
                  Didn't receive the code? Contact Support
                </a>
              </div> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;