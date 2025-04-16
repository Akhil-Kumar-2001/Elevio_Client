'use client'

import AdminSidebar from "@/components/admin/adminsidebar";
import { useParams } from 'next/navigation'
import {  getTutor } from "@/app/service/admin/adminApi";
import { useEffect, useState } from "react";
import { Tutor } from "@/types/types";
import { useRouter } from "next/navigation";
import VerificationModal from "@/components/admin/verificationConfirmModal";
import Link from "next/link";

const TutorVerificationDetails = () => {
    const { id } = useParams()
    const [tutor, setTutor] = useState<Tutor | null>(null);
    const [tutorId, setTutorId] = useState<string | null>(null);
    const router = useRouter()

    const tutorData = async () => {
        try {
            const response = await getTutor(id as string);
            if (response.data) setTutor(response.data)
        } catch (error) {
            console.log("error while getting tutor details", error)
            router.push('/not-found');
        }
    }

    useEffect(() => {
        if (id) {
            setTutorId(id as string);
            tutorData();
        }
    }, [id])


    return (
        <div className="flex min-h-screen bg-black text-white">
            {/* Navbar (Top) */}
            <div className="fixed top-0 left-0 w-full border-b border-gray-800 bg-black z-50 h-16">
                <div className="flex items-center h-full px-4">
                <Link href={`/admin/dashboard`} className="text-xl font-bold">Elevio</Link>                </div>
            </div>

            {/* Sidebar */}
            <div className="fixed top-0 left-0 h-full w-64 bg-black pt-12 z-40 border-r border-gray-800">
                <AdminSidebar />
            </div>

            {/* Main Content Area */}
            <div className="ml-64 w-[calc(100%-256px)] pt-12 min-h-screen">
                <div className="p-6 overflow-y-auto">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-xl font-semibold mb-7 mt-7">Tutor Verification Details</h1>
                        {/* Personal Information */}
                        <div className="bg-[#1E2125] p-6 rounded-lg mb-4">
                            <h3 className="text-lg font-semibold mb-4">👤 Personal Information</h3>
                            <div className="grid grid-cols-2 gap-y-4">
                                <div>
                                    <p className="text-gray-400">Name</p>
                                    <p className="font-semibold">{tutor ? tutor.username : "Loading..."}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Email</p>
                                    <p className="font-semibold">{tutor ? tutor.email : "Loading..."}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Role</p>
                                    <p className="font-semibold">{tutor ? tutor.role : "Loading..."}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Status</p>
                                    <span className="bg-yellow-600 text-white text-sm px-3 py-1 rounded-full">
                                        {tutor ? tutor.isVerified : "Loading..."}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Bio Section */}
                        <div className="bg-[#1E2125] p-6 rounded-lg mb-4">
                            <h3 className="text-lg font-semibold mb-2">📄 Bio</h3>
                            <p className="text-gray-300">{tutor ? tutor.profile.bio : "Loading..."}</p>
                        </div>

                        {/* Experience and Qualification */}
                        <div className="bg-[#1E2125] p-6 rounded-lg mb-4">
                            <div className="grid grid-cols-2 gap-y-4">
                                <div>
                                    <p className="text-gray-400">Qualification</p>
                                    <p className="font-semibold">{tutor ? tutor.profile.qualification : "Loading..."}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Experience</p>
                                    <p className="font-semibold">{tutor ? tutor.profile.experience : "Loading..."}</p>
                                </div>
                            </div>
                        </div>

                        {/* Skills Section */}
                        <div className="bg-[#1E2125] p-6 rounded-lg mb-4">
                            <h3 className="text-lg font-semibold">Skills</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tutor?.profile?.skills && tutor.profile.skills.length > 0 ? (
                                    tutor.profile.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-400">No skills listed</span>
                                )}
                            </div>
                        </div>



                        {/* Verification Documents */}
                        <div className="bg-[#1E2125] p-6 rounded-lg mb-4">
                            <h3 className="text-lg font-semibold text-white">Verification Documents</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                {tutor?.profile?.documents && tutor.profile.documents.length > 0 ? (
                                    tutor.profile.documents.map((doc, index) => (
                                        <div key={index} className="bg-[#212529] rounded-lg overflow-hidden">
                                            <img
                                                src={doc.fileUrl}
                                                alt={doc.type}
                                                className="w-full h-40 object-cover"
                                            />
                                            <div className="p-4">
                                                <p className="font-semibold text-white">{doc.type.replace("_", " ").toUpperCase()}</p>
                                                <p className="text-gray-400 text-sm">{doc.type}.pdf</p>
                                                <div className="flex justify-between mt-2 text-sm text-blue-400">
                                                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">View</a>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400">No documents uploaded</p>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end mt-6 space-x-4">
                            <VerificationModal
                                tutorId={tutorId}
                                type="reject"
                            />
                            <VerificationModal
                                tutorId={tutorId}
                                type="approve"
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default TutorVerificationDetails;

