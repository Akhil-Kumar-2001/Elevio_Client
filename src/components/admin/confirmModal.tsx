'use client'

import React from 'react';
import { AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText
}) => {
  const isBlocking = confirmText.toLowerCase() === 'block' || confirmText.toLowerCase() === 'reject';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div 
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20 
            }}
            className="bg-[#1E2125] rounded-lg p-6 w-96 shadow-2xl border border-gray-700"
          >
            <div className="flex items-center mb-4 animate-pulse">
              <AlertCircle className="w-6 h-6 mr-2 text-yellow-500" />
              <h2 className="text-lg font-semibold">{title}</h2>
            </div>
            <p className="text-gray-300 mb-6 animate-fade-in">
              {message}
            </p>
            <div className="flex justify-end space-x-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                onClick={onClose}
              >
                Cancel
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  ${isBlocking
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                  } 
                  text-white px-4 py-2 rounded-lg
                `}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {confirmText}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;