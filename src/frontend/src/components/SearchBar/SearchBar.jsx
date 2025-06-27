import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="relative w-1/4">
      <input
        type="text"
        placeholder="Pesquisar..."
        className="w-full pl-4 pr-10 py-2 rounded-full border border-white bg-transparent text-white  focus:outline-none focus:ring-2  "
      />
      <Search
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
        size={20}
      />
    </div>
  );
}
