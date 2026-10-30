import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import logo from '../../../../assets/logo/LogoSimbol.png';
import BtnCallToAction from '../../../btn/BtnCallToAction/BtnCallToAction';

export default function PublicHeader() {

  const [menuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => setMenuVisible(!menuVisible);

  useEffect(() => {
    if (!menuVisible) return;
    const handleKeyDown = (e) => { if (e.key === 'Escape') setMenuVisible(false) };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuVisible]);

  return (
    <header className="sticky top-0 left-0 w-full min-h-18 md:min-h-22 bg-[var(--purple-primary)] text-white z-50 shadow-md px-4 sm:px-10 md:px-15 py-2 flex items-center justify-between gap-4">

      <Link
        to="/"
        className="flex items-center gap-2 min-w-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--light)]"
      >
        <img src={logo} alt="" width="218" height="99" className="h-7 sm:h-8 md:h-10 lg:h-12 w-auto shrink-0" />
        <span className="text-[clamp(1rem,5.5vw,1.25rem)] md:text-2xl lg:text-4xl font-semibold whitespace-nowrap">Her Tech Rise</span>
      </Link>

      {/* BOTÃO HAMBURGUER MOBILE */}
      <button
        type="button"
        className="lg:hidden shrink-0 cursor-pointer p-1 rounded-md focus-visible:outline-2 focus-visible:outline-[var(--light)]"
        onClick={toggleMenu}
        aria-label={menuVisible ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={menuVisible}
        aria-controls="public-nav"
      >
        <svg viewBox="0 0 60 40" className="w-8 h-8" aria-hidden="true">
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
      </button>

      {/* NAVEGAÇÃO */}
      <nav
        id="public-nav"
        aria-label="Acesso à conta"
        className={`${
          menuVisible
            ? 'flex flex-col gap-4 bg-(--purple-primary) absolute top-full right-0 sm:right-4 px-6 py-6 shadow-xl w-max min-w-[12rem] max-w-[calc(100vw-2rem)] z-40 rounded-b-xl'
            : 'hidden'
        } lg:flex lg:flex-row lg:items-center lg:gap-6 lg:static lg:p-0 lg:shadow-none lg:min-w-0`}
      >
        <BtnCallToAction variant="border" to="/login">
          LOGIN
        </BtnCallToAction>
        <BtnCallToAction variant="white" to="/cadastro">
          CADASTRE-SE
        </BtnCallToAction>
      </nav>

    </header>
  );
}
