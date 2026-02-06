import React, { useState } from 'react';

import logo from '../../../../assets/logo/LogoSimbol.png';
import SearchBar from '../../../SearchBar/SearchBar';
import NavMenuHeader from './components/NavMenu';
import { Search } from 'lucide-react';

export default function PrivateHeader({ routes }) {

  const [menuVisible, setMenuVisible] = useState(false);
  const [searchMode, setSearchMode] = useState('none');

  const toggleMenu = () => {
    setSearchMode('none');
    setMenuVisible(prev => !prev);
  };
  const closeSearch = () =>  setSearchMode('none');
  const openOverlaySearch = () => {
    setMenuVisible(false);
    setSearchMode('overlay');
  };

  return (
    <>
    <header className="fixed top-0 left-0 w-full h-25 bg-[var(--purple-primary)] text-white z-50 shadow-md px-6 pr-15 md:px-15 flex items-center justify-start">
       
      <div className="flex items-center gap-2">
        <img src={logo} alt="Logo Her Tech Rise" className="w-auto max-w-12 md:max-w-20 lg:max-w-30" />
        <span className="text-xl md:text-2xl lg:text-4xl font-semibold whitespace-nowrap">Her Tech Rise</span>
      </div>

      <div className="hidden lg:flex w-2/5 justify-center">
          <SearchBar />
      </div>

      <div className="ml-auto flex items-center gap-3 lg:hidden">
         {/* LUPA */}
         <button className="text-white m-1" aria-label="Pesquisar" onClick={openOverlaySearch} >
           <Search size={20} />
         </button>

      {/* BOTÃO HAMBURGUER MOBILE */}
      <div className="lg:hidden cursor-pointer z-[60]" onClick={toggleMenu}>
        <svg viewBox="0 0 60 40" className="w-8 h-8">
          <g stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M10,10 L50,10"
              className={`transition-all duration-300 origin-center ${menuVisible ? 'translate-y-[10px] rotate-45' : ''}`}
            />
            <path
              d="M10,20 L50,20"
              className={`transition-all duration-300 ${menuVisible ? 'opacity-0' : 'opacity-100'}`}
            />
            <path
              d="M10,30 L50,30"
              className={`transition-all duration-300 origin-center ${menuVisible ? '-translate-y-[10px] -rotate-45' : ''}`}
            />
          </g>
        </svg>
      </div>
      </div>

      {/* NAVEGAÇÃO */}
      <nav
        className={`${
          menuVisible
            ? 'flex flex-col gap-4 bg-(--purple-primary) fixed top-25 right-4 px-6 py-6 shadow-xl w-max min-w-[12rem] z-40 rounded-bl-xl'
            : 'hidden'
        } lg:flex lg:items-center lg:gap-6 lg:relative`}
      >
        <NavMenuHeader routes={routes} isHovered={true} />

      </nav>
    </header>
    {searchMode === 'overlay' && (
       <>
         {/* FUNDO */}
         <div
           className="fixed inset-0 bg-black/40 z-40"
           onClick={closeSearch}
         />


         {/* CAMPO */}
         <div
           className="fixed top-25 left-0 w-full z-50
                      bg-[var(--purple-primary)]/50 backdrop-blur-md
                      py-5 shadow-lg flex justify-center"
           onClick={(e) => e.stopPropagation()}
           onKeyDownCapture={(e) => {
             if (e.key === 'Enter') closeSearch();
           }}
         >
           <SearchBar autoFocus />
         </div>
       </>
     )}
</>
  );
}