import React, { useState } from 'react';

import logo from '../../../../assets/logo/LogoSimbol.png';
import SearchBar from '../../../SearchBar/SearchBar';
import NavMenuHeader from './components/NavMenu';

export default function PrivateHeader({ routes }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => setMenuVisible(!menuVisible);

  return (
    <header className="fixed top-0 left-0 w-full h-25 bg-(--purple-primary) text-white z-50 shadow-md px-15 flex items-center justify-between">
       
        <div className="flex items-center gap-4">
        <img src={logo} alt="Logo Her Tech Rise" className="w-auto max-w-30" />
        <span className="text-4xl font-semibold">Her Tech Rise</span>
        </div>

        <div className="hidden lg:block w-2/5">
            <SearchBar />
        </div>

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

      {/* NAVEGAÇÃO */}
      <nav
        className={`${
          menuVisible
            ? 'flex flex-col gap-4 bg-(--purple-primary) absolute top-20 right-0 px-6 py-6 shadow-xl w-64 z-40'
            : 'hidden'
        } lg:flex lg:items-center lg:gap-6 lg:relative`}
      >
        <NavMenuHeader routes={routes} isHovered={true} />

      </nav>
    </header>
  );
}