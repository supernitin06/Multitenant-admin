import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-white dark:bg-slate-90
    0 shadow px-2 sm:px-4 lg:px-6 py-3 flex justify-center items-center">
      <div className="flex-shrink-0">
        <img
          src="/assests/logo/schoolmangementsystem-high-resolution-logo-transparent.png"
          alt="Logo"
          className="h-3 sm:h-5 md:h-5 lg:h-6 w-auto"
        />
      </div>
    </nav>
  );
};

export default Navbar; 
