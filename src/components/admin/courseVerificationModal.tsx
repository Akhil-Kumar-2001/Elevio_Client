// components/admin/courseVerificationModal.tsx
'use client'

import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { approveCourseVerification, rejectCourseVerification } from '@/app/service/admin/adminApi';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface CourseVerificationModalProps {
  courseId: string | null;
  type: 'approve' | 'reject';
  tutorId:string | null;
}

const CourseVerificationModal: React.FC<CourseVerificationModalProps> = ({ courseId,tutorId, type }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerification = async () => {
    if (!courseId) {
      toast.error('Course ID is missing');
      return;
    }

    setLoading(true);
    try {
      if (type === 'approve') {
        const response = await approveCourseVerification(courseId);
        if (response && response.success) {
          toast.success('Course approved successfully');
          router.push('/admin/courseverification');
        } else {
          toast.error('Failed to approve course');
        }
      } else {
        if (!reason.trim()) {
          toast.error('Please provide a reason for rejection');
          setLoading(false);
          return;
        }

        if (!tutorId) {
          toast.error('Please provide a tutorId for rejection');
          setLoading(false);
          return;
        }

        const response = await rejectCourseVerification(courseId,tutorId, reason);
        if (response && response.success) {
          toast.success('Course rejected successfully');
          router.push('/admin/courseverification');
        } else {
          toast.error('Failed to reject course');
        }
      }
      setIsOpen(false);
      setReason('');
    } catch (error) {
      console.error(`Error ${type}ing course:`, error);
      toast.error(`Failed to ${type} course`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Button to open modal */}
      {type === 'approve' ? (
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 hover:scale-105"
          onClick={() => setIsOpen(true)}
          disabled={loading}
        >
          <CheckCircle className="w-5 h-5 mr-2" /> Approve
        </button>
      ) : (
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 hover:scale-105"
          onClick={() => setIsOpen(true)}
          disabled={loading}
        >
          <XCircle className="w-5 h-5 mr-2" /> Reject
        </button>
      )}

      {/* Modal */}
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
                type: 'spring',
                stiffness: 300,
                damping: 20,
              }}
              className="bg-[#1E2125] rounded-lg p-6 w-96 shadow-2xl border border-gray-700"
            >
              <div className="flex items-center mb-4 animate-pulse">
                <AlertCircle className="w-6 h-6 mr-2 text-yellow-500" />
                <h2 className="text-lg font-semibold text-white">
                  {type === 'approve' ? 'Approve Course Verification' : 'Reject Course Verification'}
                </h2>
              </div>
              <p className="text-gray-300 mb-6 animate-fade-in">
                {type === 'approve'
                  ? 'Are you sure you want to approve this course?'
                  : 'Please provide a reason for rejecting this course.'}
              </p>

              {type === 'reject' && (
                <div className="mb-6">
                  <label htmlFor="rejection-reason" className="block text-sm font-medium text-gray-300 mb-2">
                    Reason for Rejection <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="rejection-reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter the reason for rejecting this course (e.g., incomplete content, missing resources, etc.)"
                    className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    rows={4}
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    This reason will be shared with the course creator for feedback.
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                  onClick={() => {
                    setIsOpen(false);
                    setReason(''); // Reset reason when canceling
                  }}
                  disabled={loading}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    ${type === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                    text-white px-4 py-2 rounded-lg
                  `}
                  onClick={handleVerification}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : type === 'approve' ? 'Approve' : 'Reject'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CourseVerificationModal;