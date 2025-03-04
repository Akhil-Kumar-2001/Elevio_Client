'use client'

import { getTutor } from "@/app/service/tutor/tutorApi";
import { useState } from "react";
import useAuthStore from "@/store/tutorAuthStore";
import { useRouter } from "next/navigation";

const Navbar = () => {
  interface TutorType {
    _id: string;
    username: string;
    email: string;
    status: number;
    role: string;
    createdAt: string;
  }
  const router = useRouter()
  const [tutor, setTutor] = useState<TutorType | null>(null);

  const { user } = useAuthStore();
  const tutorId = user?.id; // ✅ Retrieve tutor ID

  const fetchTutorDetails = async () => {
    try {
      if (!tutorId) {
        console.error("Tutor ID is missing! User may not be authenticated.");
        return;
      }

      const response = await getTutor(tutorId);
      setTutor(response);
      console.log("Tutor Details:", response.data);
      const verificationStatus = response.data.isVerified
      verificationStatus == "not_verified" ? router.push('/tutor/verification') : verificationStatus == "pending" ?router.push('/tutor/pending-page') : router.push('/tutor/home')
    } catch (error) {
      console.error("Failed to fetch tutor details:", error);
    }
  };

  return (
    <nav className="w-full flex items-center justify-between px-12 py-3 border-b border-gray-200 bg-white">
      {/* Logo on the left */}
      <div className="flex items-center">
        <h2 className="font-bold text-black text-2xl">Elevio</h2>
      </div>

      {/* Profile on the right */}
      <div
        className="bg-blue-100 text-blue-800 rounded-full h-9 w-9 flex items-center justify-center font-semibold cursor-pointer"
        onClick={fetchTutorDetails} // ✅ Corrected function call
      >
        AK
      </div>
    </nav>
  );
};

export default Navbar;
