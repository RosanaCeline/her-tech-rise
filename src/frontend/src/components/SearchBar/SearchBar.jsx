import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="relative w-3/5">
      <input
        type="text"
        placeholder="Pesquisar..."
         className="w-full pl-4 pr-10 py-2 rounded-full border border-white text-white bg-white/10 
             focus:outline-none focus:ring-1 focus:ring-white focus:bg-white/20
             transition-all duration-300 ease-in-out"
      />
      <Search
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
        size={20}
      />
    </div>
  );
}
