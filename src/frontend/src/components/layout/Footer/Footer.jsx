import React from 'react';
import logo from '../../../assets/logo/LogoName.png';

export default function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="w-full bg-(--purple-secundary) flex flex-col md:flex-row justify-between items-center px-20 py-6 text-white text-m lg:flex-row">
      <a
        href="https://github.com/RosanaCeline/her-tech-rise"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img  src={logo} 
            alt="Logo Her Tech Rise" />
      </a>
      <span className="mt-4 md:mt-0 w-full text-center lg:text-right lg:w-auto">
        © Copyright Her Tech Rise {currentYear}. Todos os direitos reservados.
      </span>
    </footer>
  );
}