import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FiGrid, FiUsers, FiCheckCircle, FiCircle, FiFolder, FiLogOut } from 'react-icons/fi';

const AdminSidebar = () => {
  const router = useRouter();

  const menuItems = [
    { label: 'Dashboard', icon: <FiGrid size={24} />, path: '/admin/dashboard' },
    { label: 'Tutor Management', icon: <FiUsers size={24} />, path: '/admin/tutormanagement' },
    { label: 'Students Management', icon: <FiUsers size={24} />, path: '/admin/studentsmanagement' },
    { label: 'Tutor Verification', icon: <FiCheckCircle size={24} />, path: '/admin/tutor-verification' },
    { label: 'Subscription', icon: <FiCircle size={24} />, path: '/admin/subscription' },
    { label: 'Category', icon: <FiFolder size={24} />, path: '/admin/category' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('authUserCheck');
    toast.success('Logged out successfully!');
    router.push('/admin/login'); // Redirect to login page
  };

  return (
    <div className="w-64 bg-black text-white border-r border-gray-700 p-6 flex flex-col min-h-screen">
      {/* Sidebar Navigation */}
      <nav className="space-y-4 flex-1">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center space-x-3 p-2 rounded text-gray-300 transition duration-300 ease-in-out hover:bg-white hover:bg-opacity-10 hover:text-white cursor-pointer"
            onClick={() => router.push(item.path)}
          >
            {item.icon}
            <span className="whitespace-nowrap">{item.label}</span>
          </div>
        ))}
      {/* Logout Button (Sticks to the Bottom) */}
      <div
        className="flex items-center space-x-3 text-gray-300 p-2 rounded transition duration-300 ease-in-out hover:bg-red-500 hover:bg-opacity-20 hover:text-red-400 cursor-pointer mt-auto"
        onClick={handleLogout}>
        <FiLogOut size={24} />
        <span>Logout</span>
      </div>
      </nav>

    </div>
  );
};

export default AdminSidebar;



  // 'use client';
  // import { usePathname, useRouter } from 'next/navigation';
  // import { toast } from 'react-toastify';
  // import { FiGrid, FiUsers, FiCheckCircle, FiCircle, FiFolder, FiLogOut } from 'react-icons/fi';

  // const AdminSidebar = () => {
  //   const router = useRouter();
  //   const pathname = usePathname(); // Get the current route

  //   const menuItems = [
  //     { label: 'Dashboard', icon: <FiGrid size={24} />, path: '/admin/dashboard' },
  //     { label: 'Tutor Management', icon: <FiUsers size={24} />, path: '/admin/tutormanagement' },
  //     { label: 'Students Management', icon: <FiUsers size={24} />, path: '/admin/studentsmanagement' },
  //     { label: 'Tutor Verification', icon: <FiCheckCircle size={24} />, path: '/admin/tutor-verification' },
  //     { label: 'Subscription', icon: <FiCircle size={24} />, path: '/admin/subscription' },
  //     { label: 'Category', icon: <FiFolder size={24} />, path: '/admin/category' },
  //   ];

  //   const handleLogout = () => {
  //     localStorage.removeItem('authUserCheck');
  //     toast.success('Logged out successfully!');
  //     router.push('/admin/login');
  //   };

  //   return (
  //     <div className="w-64 bg-black text-white border-r border-gray-700 p-6 flex flex-col min-h-screen">
  //       {/* Sidebar Navigation */}
  //       <nav className="space-y-4 flex-1">
  //         {menuItems.map((item) => (
  //           <div
  //             key={item.label}
  //             className={`flex items-center space-x-3 p-2 rounded transition duration-300 ease-in-out cursor-pointer 
  //               ${pathname === item.path ? 'bg-white bg-opacity-10 text-white' : 'text-gray-300 hover:bg-white hover:bg-opacity-10 hover:text-white'}`}
  //             onClick={() => router.push(item.path)}
  //           >
  //             {item.icon}
  //             <span className="whitespace-nowrap">{item.label}</span>
  //           </div>
  //         ))}
  //       {/* Logout Button */}
  //       <div
  //         className="flex items-center space-x-3 text-gray-300 p-2 rounded transition duration-300 ease-in-out hover:bg-red-500 hover:bg-opacity-20 hover:text-red-400 cursor-pointer mt-auto"
  //         onClick={handleLogout}
  //       >
  //         <FiLogOut size={24} />
  //         <span>Logout</span>
  //       </div>
  //       </nav>

  //     </div>
  //   );
  // };

  // export default AdminSidebar;
