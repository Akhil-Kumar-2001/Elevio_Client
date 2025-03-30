'use client';

import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastComponent = () => {
  // Example function to trigger a toast
  const showToast = () => {
    toast.success('🚀 Operation successful!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'dark', // Set base theme to dark
      className: 'custom-toast',
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
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" // Base theme set to dark
      />

      {/* Custom CSS styles for dark theme */}
      <style jsx global>{`
        .Toastify__toast {
          border-radius: 8px;
          padding: 12px 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          margin-bottom: 12px;
          background: #1e293b; /* Dark slate background */
          border: 1px solid #334155; /* Subtle border */
          font-family: system-ui, -apple-system, sans-serif;
        }

        .Toastify__toast-body {
          font-size: 14px;
          color: #e2e8f0; /* Light gray text for readability */
          padding: 4px 0;
        }

        .Toastify__close-button {
          color: #94a3b8; /* Light slate for close button */
          opacity: 0.7;
          padding: 4px;
          transition: opacity 0.2s ease;
        }

        .Toastify__close-button:hover {
          opacity: 1;
          color: #cbd5e1; /* Slightly brighter on hover */
        }

        .Toastify__progress-bar {
          background: linear-gradient(to right, #3b82f6, #60a5fa); /* Blue gradient for progress */
          height: 3px;
          border-radius: 2px;
        }

        .Toastify__toast--success {
          border-left: 4px solid #22c55e; /* Green for success */
          background: #1e293b; /* Consistent dark background */
        }

        .Toastify__toast--error {
          border-left: 4px solid #ef4444; /* Red for error */
          background: #1e293b;
        }

        .Toastify__toast--warning {
          border-left: 4px solid #f59e0b; /* Amber for warning */
          background: #1e293b;
        }

        .Toastify__toast--info {
          border-left: 4px solid #3b82f6; /* Blue for info */
          background: #1e293b;
        }

        /* Optional: Customize the toast icon */
        .Toastify__toast-icon {
          color: #94a3b8; /* Match icon color to theme */
        }
      `}</style>
    </div>
  );
};

export default ToastComponent;