const Navbar = () => {
    return (
      <nav className="w-full flex items-center justify-between px-12 py-3 border-b border-gray-200 bg-white">
        {/* Logo on the left */}
        <div className="flex items-center">
          <h2 className="font-bold text-black text-2xl">Elevio</h2>
        </div>
  
        {/* Profile on the right */}
        <div className="bg-blue-100 text-blue-800 rounded-full h-9 w-9 flex items-center justify-center font-semibold">
          AK
        </div>
      </nav>
    );
  };
  
  export default Navbar;
  