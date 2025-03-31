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

      {/* feature section - updated to horizontal layout */}

      <div className="w-full bg-pink-100 py-16 px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Features</h1>

        <div className="max-w-6xl mx-auto flex flex-row flex-wrap justify-center items-center gap-12">
          {/* Chat with Tutor Feature */}
          <div className="flex flex-col items-center">
            <div className="border-2 border-pink-200 rounded-lg p-8 bg-pink-50 mb-4 w-48 h-48 flex items-center justify-center">
              <div className="text-black w-16 h-16">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v3c0 .6.4 1 1 1h.5c.2 0 .5-.1.7-.3l3.8-3.7H20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 12H7c-.6 0-1-.4-1-1s.4-1 1-1h10c.6 0 1 .4 1 1s-.4 1-1 1z" />
                </svg>
              </div>
            </div>
            <h3 className="font-medium text-lg text-center text-black">Chat with Tutor</h3>
            <p className="text-gray-700 text-center text-sm mt-2 max-w-xs">
              Instantly message tutors to clear doubts and receive personalized guidance anytime.
            </p>
          </div>

          {/* Video Chat with Tutor Feature */}
          <div className="flex flex-col items-center">
            <div className="border-2 border-pink-200 rounded-lg p-8 bg-pink-50 mb-4 w-48 h-48 flex items-center justify-center">
              <div className="text-black w-16 h-16">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                </svg>
              </div>
            </div>
            <h3 className="font-medium text-lg text-center text-black">Video Chat with Tutor</h3>
            <p className="text-gray-700 text-center text-sm mt-2 max-w-xs">
              Connect face-to-face tutors for live discussions and interactive learning sessions.
            </p>
          </div>

          {/* Subscription for Users Feature */}
          <div className="flex flex-col items-center">
            <div className="border-2 border-pink-200 rounded-lg p-8 bg-pink-50 mb-4 w-48 h-48 flex items-center justify-center">
              <div className="text-black w-16 h-16">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            </div>
            <h3 className="font-medium text-lg text-center text-black">Subscription for Users</h3>
            <p className="text-gray-700 text-center text-sm mt-2 max-w-xs">
              Access exclusive courses and features with affordable subscription plans for limitless learning.
            </p>
          </div>
        </div>
      </div>

      {/* Footer section */}

      <footer className="bg-black text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Column */}
            <div>
              <h3 className="text-white font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">About Us</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">Why Choose us</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">Pricing</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">Testimonial</Link></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h3 className="text-white font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">Terms and Condition</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">Blog</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">Contact Us</Link></li>
              </ul>
            </div>

            {/* Product Column */}
            <div>
              <h3 className="text-white font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">Project management</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">Time tracker</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">Time schedule</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">Lead generate</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white text-sm">Remote Collaboration</Link></li>
              </ul>
            </div>

            {/* Brand Column */}
            <div className="flex justify-end md:justify-end">
              <h2 className="text-3xl font-bold">Elevio</h2>
            </div>
          </div>

          {/* Bottom Section with Copyright and Social Icons */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-800">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              Copyright ©2022
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-gray-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22,12.14c0-5.52-4.48-10-10-10S2,6.62,2,12.14c0,4.95,3.58,9.05,8.28,9.86v-6.97H7.84v-2.89h2.44v-2.2c0-2.4,1.42-3.72,3.61-3.72c1.04,0,2.13,0.19,2.13,0.19v2.33H14.9c-1.19,0-1.56,0.73-1.56,1.49v1.8h2.65l-0.42,2.89h-2.22v6.97C18.42,21.19,22,17.09,22,12.14z" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.212 4H5.785C4.799 4 4 4.799 4 5.785v12.427C4 19.201 4.799 20 5.785 20h12.427C19.207 20 20 19.204 20 18.212V5.785C20 4.799 19.207 4 18.212 4zM9 16H7V8h2v8zm-1.2-9.5a1.05 1.05 0 0 1 0-2.1 1.05 1.05 0 0 1 0 2.1zM17 16h-2v-4c0-1.105-.895-2-2-2s-2 .895-2 2v4h-2V8h2v1.5a3.3 3.3 0 0 1 2.85-1.5c1.575 0 3.15 1.05 3.15 3v5z" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 1 0 0-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 0 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default EducationLanding;