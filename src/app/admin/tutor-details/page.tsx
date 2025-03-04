'use client'

import AdminSidebar from "@/components/adminsidebar";
import { CheckCircle, XCircle } from "lucide-react";

const TutorVerificationDetails = () => {
    return (
        <div className="bg-black text-white min-h-screen">

            {/* Header */}
            <div className="bg-black text-white p-4 border-b border-gray-700 flex justify-between items-center">
                <div className="text-xl font-bold">Elevio</div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1">
                <AdminSidebar />
                <div className="flex-1 p-6">
                    <div className="max-w-3xl mx-auto">
                        {/* Tutor Verification Header */}
                        <h2 className="text-xl font-semibold mb-4">Tutor Verification Details</h2>

                        {/* Personal Information */}
                        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold flex items-center mb-4">
                                <span className="mr-2">👤</span> Personal Information
                            </h3>
                            <div className="grid grid-cols-2 gap-y-4">
                                <div>
                                    <p className="text-gray-400">Name</p>
                                    <p className="font-semibold">Akhil Kumar S</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Email</p>
                                    <p className="font-semibold">akhilkumar.s2001@gmail.com</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Role</p>
                                    <p className="font-semibold">Tutor</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Status</p>
                                    <span className="bg-yellow-600 text-white text-sm px-3 py-1 rounded-full">
                                        pending
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Bio Section */}
                        <div className="bg-gray-900 p-6 mt-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold flex items-center mb-2">
                                <span className="mr-2">📄</span> Bio
                            </h3>
                            <p className="text-gray-300">
                                I am a passionate educator with over 5 years of experience teaching
                                mathematics and computer science. I believe in making complex
                                concepts simple and engaging for students of all levels.
                            </p>
                        </div>

                        {/* Experience and Qualification */}
                        <div className="bg-gray-900 p-6 mt-4 rounded-lg shadow-md">
                            <div className="grid grid-cols-2 gap-y-4">
                                <div>
                                    <p className="text-gray-400">Qualification</p>
                                    <p className="font-semibold">MCA</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Experience</p>
                                    <p className="font-semibold">ABC Company 2022 - 2025</p>
                                </div>
                            </div>
                        </div>

                        {/* Skills Section */}
                        <div className="bg-gray-900 p-6 mt-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold">Skills</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {["Mathematics", "Computer Science", "Programming", "Web Development", "Data Structures", "Algorithms"].map(
                                    (skill, index) => (
                                        <span
                                            key={index}
                                            className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm"
                                        >
                                            {skill}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Verification Documents */}
                        <div className="bg-gray-900 p-6 mt-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold">Verification Documents</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                {/* ID Card */}
                                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md">
                                    <img
                                        src="https://source.unsplash.com/400x200/?id,card" // Replace with actual image
                                        alt="ID Card"
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="p-4">
                                        <p className="font-semibold">ID Card</p>
                                        <p className="text-gray-400 text-sm">id_card.pdf</p>
                                        <div className="flex justify-between mt-2 text-sm text-blue-400">
                                            <a href="#">⬇ Download</a>
                                            <a href="#">View</a>
                                        </div>
                                    </div>
                                </div>

                                {/* Experience Certificate */}
                                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md">
                                    <img
                                        src="https://source.unsplash.com/400x200/?certificate,document" // Replace with actual image
                                        alt="Experience Certificate"
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="p-4">
                                        <p className="font-semibold">Experience Certificate</p>
                                        <p className="text-gray-400 text-sm">experience_certificate.pdf</p>
                                        <div className="flex justify-between mt-2 text-sm text-blue-400">
                                            <a href="#">⬇ Download</a>
                                            <a href="#">View</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Approve & Reject Buttons */}
                        <div className="flex justify-end mt-6 space-x-4">
                            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center">
                                <XCircle className="w-5 h-5 mr-2" /> Reject
                            </button>
                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center">
                                <CheckCircle className="w-5 h-5 mr-2" /> Approve
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default TutorVerificationDetails;
