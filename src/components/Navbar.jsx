import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-[#0f172a] border-b border-gray-800 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">M</div>
        <span className="text-xl font-bold text-white tracking-tight">MediaTracker</span>
      </div>
      
      <div className="hidden md:flex items-center gap-10 text-gray-400 font-medium">
        <a href="#" className="hover:text-indigo-400 transition-colors">Keşfet</a>
        <a href="#" className="hover:text-indigo-400 transition-colors">Arşivim</a>
      </div>

      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-semibold transition-all">
        Giriş Yap
      </button>
    </nav>
  );
};

export default Navbar;