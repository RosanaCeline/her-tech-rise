import logo from '../../../assets/logo/LogoName.png';

export default function Footer() {

  const currentYear = new Date().getFullYear();
  const goToRepository = () => window.open('https://github.com/RosanaCeline/her-tech-rise', '_blank', 'noopener,noreferrer');
  
  return (
    <footer className="w-full bg-[var(--purple-secundary)] text-white text-m text-center md:text-left items-center justify-between md:justify-between
                        flex flex-col md:flex-row lg:flex-row px-6 sm:px-12 py-6 gap-2 md:gap-6">
      <a
        onClick={goToRepository}
        className="shrink-0 cursor-pointer"
      >
        <img src={logo} 
            alt="Logo Her Tech Rise"
            className="h-8 md:h-10 w-auto"
        />
      </a>
      <button onClick={goToRepository} className="bg-transparent p-0 text-white hover:underline text-sm md:text-base mt-4 md:mt-0 w-full text-center lg:text-right lg:w-auto">
        © Copyright Her Tech Rise {currentYear}. Todos os direitos reservados.
      </button>
    </footer>
  );
}
