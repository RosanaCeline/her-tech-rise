import { useLocation } from 'react-router-dom';
import LoginForm from './components/LoginForm'
import logo from "../../../assets/logo/LogoNamePurple.png";
import login from "../../../assets/auth/login.png";

export default function Login ({ resetPass, registerPath, enter }) {

  const location = useLocation();
  const sessionExpired = location.state?.expired;

  return (
    <main className='flex bg-[#F7F7F7]'>
      <LoginForm  resetPass = {resetPass}
                  registerPath = {registerPath}
                  enter = {enter} />
      <div className='hidden md:w-1/2 md:flex md:flex-col justify-center p-4'>

        {sessionExpired && (
          <div className="text-base bg-red-700 text-white mt-1 flex items-center gap-2 w-1/2 ml-auto p-4 rounded-md m-4">
            Sua sessão expirou. Faça login novamente para continuar.
          </div>
        )}

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
