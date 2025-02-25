import React from 'react';
import Link from "next/link";

const EducationLanding = () => {
  return (
    <div>
      <div className="min-h-screen bg-pink-50">
        {/* Navigation */}
        <nav className="bg-[#e6e6e6] p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-lg font-semibold text-black">Elevio</div>
            <div className="space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact us</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
            </div>
          </div>
        </nav>

        {/* Main Content with adjusted spacing */}
        <main className="max-w-3xl mx-auto px-4 pt-32 text-center">
          <h1 className="text-black text-6xl font-bold mb-6">
            Education Simplified
            <br />
            Learning Amplified
          </h1>

          <h2 className="text-black text-2xl font-semibold mb-12">
            Where teaching and learning come together
          </h2>

          <p className="text-black italic leading-8 max-w-[750px] mx-auto text-center">
            Elevio is an e-learning platform where tutors can create and sell courses, and students can easily purchase and learn at their own pace. With features like chat and video calls, students and tutors can interact seamlessly to clear doubts and collaborate. Tutors can also conduct live classes and manage virtual classrooms effortlessly. Our user-friendly interface and subscription plans ensure a smooth and engaging learning experience for everyone. Join Elevio today and explore a world of endless learning opportunities!
          </p>
        </main>
      </div>

      {/* tutor section */}

      <div className="min-h-screen bg-pink-50 flex justify-center items-center p-8">
        <div className="flex items-center gap-12">
          <div className="relative w-[300px] h-[300px]">
            <div className="w-full h-full bg-pink-200 rounded-3xl" />
            <img
              src="/images/INSTRUCTOR.png"
              alt="Instructor with clipboard"
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[250px] object-contain"
            />
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-[32px] font-extrabold text-gray-900">
              Become an Instructor
            </h1>

            <p className="text-gray-700 max-w-[500px] leading-6">
              For Instructors Become an instructor and sell your courses with ease. Share your knowledge, inspire others, and help create a better learning world!
            </p>

            {/* <button className="bg-black text-white px-6 py-2 rounded w-fit hover:bg-gray-800 transition-colors">
              Sign in
            </button> */}
            <Link href="/tutor/login">
              <button className="bg-black text-white px-6 py-2 rounded w-fit hover:bg-gray-800 transition-colors">
                Sign in
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Student Section */}

      <div className=" bg-pink-50 flex justify-center items-center p-8">
        <div className="flex items-center gap-12 flex-row-reverse">
          {/* Image Section */}
          <div className="relative w-[300px] h-[300px]">
            <div className="w-full h-full bg-pink-200 rounded-3xl" />
            <img
              src="/images/St.png"
              alt="Student holding books"
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[250px] object-contain"
            />
          </div>

          {/* Text & Button Section */}
          <div className="flex flex-col gap-4">
            <h1 className="text-[32px] font-extrabold text-gray-900">
              Become a Student
            </h1>

            <p className="text-gray-700 max-w-[500px] leading-6">
              Learn at your own pace by exploring and purchasing courses.
              Connect with instructors through chat and video calls,
              clear your doubts, and enjoy interactive learning!
            </p>

            <Link href="/login">
              <button className="bg-black text-white px-6 py-2 rounded w-fit hover:bg-gray-800 transition-colors">
                Sign in
              </button>
            </Link>
          </div>
        </div>
      </div>




    </div>




  );
};

export default EducationLanding;