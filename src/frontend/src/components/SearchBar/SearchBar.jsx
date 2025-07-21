import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SearchBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams({ s: search });
    navigate(`/search?${params.toString()}`);
  }, [navigate, search]);

  useEffect(() => {
    if (location.pathname === '/search') {
      const params = new URLSearchParams(location.search);
      setSearch(params.get('s') || '')
    } else {
      setSearch('');
    }
  }, [location]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (location.pathname === '/search') handleSearch()
    }, 500); 

    return () => clearTimeout(delayDebounce);
  }, [search, navigate, location.pathname, handleSearch]);
  
  return (
    <div className="relative w-3/5">
      <input
        type="text"
        placeholder="Pesquisar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-4 pr-10 py-2 rounded-full border border-white text-white bg-white/10 
             focus:outline-none focus:ring-1 focus:ring-white focus:bg-white/20
             transition-all duration-300 ease-in-out"
        onKeyDown={(e) => {if(e.key === 'Enter') handleSearch()}}
      />
      <Search
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
        size={20}
        onClick={() => handleSearch()}
      />
    </div>
  );
}
