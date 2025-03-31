import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { approveTutorVerification, rejectTutorVerification } from "@/app/service/admin/adminApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';

interface VerificationModalProps {
  tutorId: string | null;
  type: 'approve' | 'reject';
}

const VerificationModal: React.FC<VerificationModalProps> = ({ tutorId, type }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleVerification = async () => {
    if (!tutorId) {
      toast.error("Tutor ID is missing");
      return;
    }

    try {
      if (type === 'approve') {
        const response = await approveTutorVerification(tutorId);
        if(response.success){
            toast.success("Tutor approved successfully");
            router.push('/admin/tutorverification');
        }
      } else {
       const response = await rejectTutorVerification(tutorId);
       if(response.success){
        toast.success("Tutor rejected successfully");
        router.push('/admin/tutorverification');
       }
      }
      setIsOpen(false);
    } catch (error) {
      console.log(error)
      toast.error(`Error ${type}ing tutor`);
    }
  };

  return (
    <>
      {type === 'approve' ? (
        <button 
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 hover:scale-105"
          onClick={() => setIsOpen(true)}
        >
          <CheckCircle className="w-5 h-5 mr-2" /> Approve
        </button>
      ) : (
        <button 
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 hover:scale-105"
          onClick={() => setIsOpen(true)}
        >
          <XCircle className="w-5 h-5 mr-2" /> Reject
        </button>
      )}

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
                <h2 className="text-lg font-semibold">
                  {type === 'approve' 
                    ? 'Approve Tutor Verification' 
                    : 'Reject Tutor Verification'}
                </h2>
              </div>
              <p className="text-gray-300 mb-6 animate-fade-in">
                {type === 'approve'
                  ? 'Are you sure you want to approve this tutor\'s verification?'
                  : 'Are you sure you want to reject this tutor\'s verification?'}
              </p>
              <div className="flex justify-end space-x-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    ${type === 'approve' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                    } 
                    text-white px-4 py-2 rounded-lg
                  `}
                  onClick={handleVerification}
                >
                  {type === 'approve' ? 'Approve' : 'Reject'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VerificationModal;