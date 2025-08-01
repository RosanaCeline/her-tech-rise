import React from 'react';
import logo from '../../../assets/logo/LogoName.png';

export default function Footer() {
  return (
    <footer className="w-full bg-(--purple-secundary) flex flex-col md:flex-row justify-between items-center px-20 py-6 text-white text-m lg:flex-row">
      <img  src={logo} 
            alt="Logo Her Tech Rise" 
            className="hidden lg:block w-auto max-w-[20%]" />
      <span className="mt-4 md:mt-0 w-full text-center lg:text-right lg:w-auto">
        © Copyright Her Tech Rise 2025. Todos os direitos reservados.
      </span>
    </footer>
  );
}