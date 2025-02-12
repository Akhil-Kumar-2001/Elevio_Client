'use client'

import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastComponent = () => {
  // Example function to trigger a toast
  const showToast = () => {
    toast.success('🚀 Operation successful!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      className: 'custom-toast'
    });
  };

  return (
    <div>
      {/* Button to trigger toast (for demonstration) */}
      {/* <button 
        onClick={showToast}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Show Toast
      </button> */}

      {/* Styled ToastContainer */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Custom CSS styles */}
      <style jsx global>{`
        .Toastify__toast {
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          margin-bottom: 12px;
          background: white;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .Toastify__toast-body {
          font-size: 14px;
          color: #334155;
          padding: 8px 0;
        }

        .Toastify__close-button {
          opacity: 0.7;
          padding: 4px;
        }

        .Toastify__close-button:hover {
          opacity: 1;
        }

        .Toastify__progress-bar {
          background: linear-gradient(to right, #3b82f6, #60a5fa);
          height: 4px;
        }

        .Toastify__toast--success {
          border-left: 4px solid #22c55e;
        }

        .Toastify__toast--error {
          border-left: 4px solid #ef4444;
        }

        .Toastify__toast--warning {
          border-left: 4px solid #f59e0b;
        }

        .Toastify__toast--info {
          border-left: 4px solid #3b82f6;
        }
      `}</style>
    </div>
  );
};

export default ToastComponent;