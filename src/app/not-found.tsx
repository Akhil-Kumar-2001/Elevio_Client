// import React from 'react';
// import { BookX, ArrowLeft } from 'lucide-react';

// function App() {
//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center p-4">
//       <div className="max-w-2xl w-full text-center">
//         {/* 404 Icon */}
//         <div className="mb-8 flex justify-center">
//           <div className="relative">
//             <BookX className="w-24 h-24 text-black" />
//             <div className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 py-1 rounded-full">
//               404
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <h1 className="text-6xl font-bold text-black mb-4">Page Not Found</h1>
//         <p className="text-gray-600 text-xl mb-8">
//           {"Oops! The learning resource you're looking for seems to have wandered off."}
//         </p>

//         {/* Divider */}
//         <div className="w-16 h-1 bg-black mx-auto mb-8"></div>

//         {/* Suggestions */}
//         <div className="mb-12 text-gray-500">
//           <p className="mb-2">You might want to:</p>
//           <ul className="space-y-2">
//             <li>• Check the URL for any typos</li>
//             <li>• Return to your previous lesson</li>
//             <li>• Browse our course catalog</li>
//           </ul>
//         </div>

//         {/* Back Button */}
//         <a 
//           href="/home"
//           className="inline-flex items-center px-6 py-3 border-2 border-black text-black hover:bg-black hover:text-white transition-colors duration-300 font-medium rounded-lg"
//         >
//           <ArrowLeft className="w-5 h-5 mr-2" />
//           Back to Homepage
//         </a>
//       </div>
//     </div>
//   );
// }

// export default App;






'use client';
import React, { useEffect, useState } from 'react';
import { Home, BookOpen, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const router = useRouter();
  
  // Create smooth random movement for the floating elements
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition({
        x: Math.sin(Date.now() / 1500) * 20,
        y: Math.cos(Date.now() / 1500) * 20
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-lg text-center relative">
        {/* Background elements */}
        <div 
          className="absolute -z-10 top-0 left-0 w-full h-full overflow-hidden"
          style={{ opacity: 0.6 }}
        >
          {/* Animated grid pattern */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', 
            backgroundSize: '30px 30px',
            opacity: 0.3
          }}></div>
          
          {/* Floating shapes */}
          <div className="absolute top-10 left-10 w-16 h-16 rounded-full bg-blue-200" 
               style={{ transform: `translate(${position.x * 0.7}px, ${position.y * 0.5}px)` }}></div>
          <div className="absolute bottom-10 right-10 w-20 h-20 rounded-full bg-indigo-200" 
               style={{ transform: `translate(${position.x * -0.5}px, ${position.y * 0.8}px)` }}></div>
          <div className="absolute top-40 right-20 w-12 h-12 rounded-full bg-cyan-200" 
               style={{ transform: `translate(${position.x * 0.9}px, ${position.y * -0.6}px)` }}></div>
        </div>
        
        {/* Main content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-indigo-100 relative z-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-40 h-40 rounded-full bg-indigo-100 flex items-center justify-center">
                <AlertCircle size={64} className="text-indigo-600" />
              </div>
              <div className="absolute -top-2 -right-2 flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 text-white font-bold text-2xl animate-pulse">
                404
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h1>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-indigo-200"></div>
            <BookOpen size={24} className="text-indigo-400" />
            <div className="h-px w-16 bg-indigo-200"></div>
          </div>
          
          <p className="text-gray-600 mb-8">
            {`The learning resource you're looking for cannot be found. 
            Let's get you back to your dashboard.`}
          </p>
          
          <button onClick={()=>router.back()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto transition-all duration-300 shadow-md hover:shadow-lg">
            <Home size={20} />
            Go Back
          </button>
        </div>
        
        {/* Elevio branding */}
        <div className="mt-6 text-indigo-900 font-semibold text-lg">
          Elevio Learning Platform
        </div>
      </div>
    </div>
  );
}