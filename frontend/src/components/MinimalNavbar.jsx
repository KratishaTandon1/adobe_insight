import React from 'react';

const MinimalNavbar = () => {
  return (
    <nav className="bg-[#E53935] shadow-lg sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-start">
          <div className="flex shrink-0 items-center">
            {/* The app name */}
            <a href="/" className="text-2xl font-extrabold text-white tracking-wider">
              PDFINTELLECT
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MinimalNavbar;
