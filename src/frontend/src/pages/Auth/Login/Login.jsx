import { useLocation } from 'react-router-dom';
import LoginForm from './components/LoginForm'
import logo from "../../../assets/logo/LogoNamePurple.png";
import login from "../../../assets/auth/login.png";

export default function Login ({ resetPass, registerPath, enter }) {

  const location = useLocation();
  const sessionExpired = location.state?.expired;
  const accountDeleted = location.state?.accountDeleted;

  return (
    <main className='flex min-h-screen bg-[#F7F7F7]'>
      <LoginForm  resetPass = {resetPass}
                  registerPath = {registerPath}
                  enter = {enter}
                  sessionExpired = {sessionExpired}
                  accountDeleted = {accountDeleted} />
      <div className='hidden md:w-1/2 md:flex md:flex-col justify-center gap-6 p-4'>
        <img  src={logo}
              alt="Her Tech Rise"
              width="1366" height="210"
              className='w-7/8 h-auto mx-auto'/>
        <img  src={login}
              alt=""
              width="2000" height="2000"
              className='w-2/3 h-auto mx-auto'/>
      </div>
    </main>
  )
}
