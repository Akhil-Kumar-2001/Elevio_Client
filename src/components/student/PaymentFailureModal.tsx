'use client'
import React, { useState, useEffect } from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';

interface PaymentFailureModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  message?: string;
}

const PaymentFailureModal: React.FC<PaymentFailureModalProps> = ({
  isOpen = true,
  onClose = () => {},
  message = "Your payment could not be processed. Please check your card details and try again later."
}) => {
  const [isAnimatingOut, setIsAnimatingOut] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimatingOut(false);
    } else if (!isAnimatingOut) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 600);
  };

  if (!isVisible) return null;

  return (
    <>
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scalePulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 0.6;
          }
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }
        .animate-scale-pulse {
          animation: scalePulse 2s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-500 ${isAnimatingOut ? 'opacity-0' : 'animate-fade-in'}`}
          onClick={handleClose}
        ></div>

        {/* Modal */}
        <div
          className={`relative w-full max-w-lg mx-4 transition-all duration-600 ${isAnimatingOut ? 'opacity-0 translate-y-6' : 'animate-slide-up'}`}
        >
          {/* Card */}
          <div className="overflow-hidden bg-white rounded-2xl shadow-2xl">
            {/* Red Status Bar */}
            <div className="h-2 bg-red-600"></div>

            {/* Content Container */}
            <div className="p-6 pb-8">
              {/* Header Section */}
              <div className="flex flex-col items-center py-6">
                {/* Animated Error Icon */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-red-100 rounded-full scale-150 blur-md"></div>
                  <div className="absolute inset-0 bg-red-50 rounded-full animate-pulse"></div>
                  <div className="relative">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm animate-scale-pulse">
                      <AlertCircle size={48} className="text-red-600" />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>

                {/* Decorative line */}
                <div className="w-12 h-1 bg-red-600 rounded-full mb-4"></div>
              </div>

              {/* Message */}
              <div className="text-center px-4 mb-8">
                <p className="text-gray-600 leading-relaxed">{message}</p>
              </div>

              {/* Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleClose}
                  className="group relative px-8 py-3 overflow-hidden rounded-lg bg-red-600 text-white transition-all duration-300 shadow-md hover:shadow-lg hover:bg-red-700"
                >
                  {/* Button Highlight Effect */}
                  <div className="absolute inset-0 w-0 bg-white bg-opacity-20 transition-all duration-300 group-hover:w-full"></div>

                  {/* Button Content */}
                  <div className="flex items-center justify-center relative z-10">
                    <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                    <span>Go Back</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Bottom decorative element */}
            <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-100">
              <p className="text-xs text-gray-500">
                If you continue to experience issues, please contact support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentFailureModal;