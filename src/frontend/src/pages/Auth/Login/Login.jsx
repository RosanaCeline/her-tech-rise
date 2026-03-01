import { useLocation } from 'react-router-dom';
import LoginForm from './components/LoginForm'
import logo from "../../../assets/logo/LogoNamePurple.png";
import login from "../../../assets/auth/login.png";

export default function Login ({ resetPass, registerPath, enter }) {

  const location = useLocation();
  const sessionExpired = location.state?.expired;

  return (
    <main className='flex bg-[#F7F7F7]'>

      {sessionExpired && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 
                        text-sm px-4 py-3 rounded-lg mb-4 text-center">
          Sua sessão expirou. Faça login novamente para continuar.
        </div>
      )}

      <LoginForm  resetPass = {resetPass}
                  registerPath = {registerPath}
                  enter = {enter} />
      <div    className='hidden md:w-1/2 md:flex md:flex-col justify-center p-4'>
        <img  src={logo} 
              alt="Logo Her Tech Rise" 
              className='w-7/8 mx-auto'/>
        <img  src={login} 
              alt="Imagem ilustrativa de login" 
              className='w-2/3 mx-auto'/>
      </div>
    </main>
  )
}
