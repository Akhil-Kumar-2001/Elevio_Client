'use client'

import { getTutor } from "@/app/service/tutor/tutorApi";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/tutorAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // Import Next.js Image component

const Navbar = () => {
  interface TutorType {
    _id: string;
    username: string;
    email: string;
    status: number;
    role: string;
    createdAt: string;
    profile?: {
      profilePicture?: string;
    };
  }

  const router = useRouter();
  const [tutor, setTutor] = useState<TutorType | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [demo, setDemom] = useState<string | null>(null);

  const { user } = useAuthStore();
  const tutorId = user?.id;

  const fetchTutorDetails = async () => {
    try {
      if (!tutorId) {
        console.log("Tutor ID is missing! User may not be authenticated.");
        return;
      }

      const response = await getTutor(tutorId);
      setTutor(response.data);
      const verificationStatus = response.data.isVerified;

      if (verificationStatus === "not_verified") {
        router.push("/tutor/verification");
      } else if (verificationStatus === "pending") {
        router.push("/tutor/pending-page");
      } else {
        router.push("/tutor/profile");
      }
    } catch (error) {
      console.log("Failed to fetch tutor details:", error);
    }
  };

  const getImageTutor = async () => {
    if (!tutorId) {
      console.log("Tutor ID is missing! User may not be authenticated.");
      return;
    }
    try {
      const response = await getTutor(tutorId);
      setImage(response.data.profile?.profilePicture || null);
      setDemom(response.data.username.charAt(0).toUpperCase())
      // tutor?.username ? tutor.username.charAt(0).toUpperCase()
    } catch (error) {
      console.error("Failed to fetch profile image:", error);
    }
  };

  useEffect(() => {
    getImageTutor();
  }, [tutorId]);

  return (
    <nav className="w-full flex items-center justify-between px-12 py-3 border-b border-gray-200 bg-white">
      {/* Logo on the left */}
      <div className="flex items-center">
        <Link href="/tutor/dashboard">
          <h1 className="font-bold text-black text-2xl">Elevio</h1>
        </Link>
      </div>

      {/* Profile Picture on the Right */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={fetchTutorDetails}>
        {image ? (
          <Image
            src={image}
            alt="Tutor Profile"
            width={36}
            height={36}
            className="rounded-full w-9 h-9 object-cover"
          />
        ) : (
          <div className="bg-blue-100 text-blue-800 rounded-full h-9 w-9 flex items-center justify-center font-semibold">
            {demo ? demo : ""}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
