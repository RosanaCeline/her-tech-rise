import { Navigate } from "react-router-dom";

import ResetForm from './components/ResetForm'
import logo from "../../../assets/logo/LogoNamePurple.png";
import login from "../../../assets/auth/login.png";
import { useAuth } from "../../../context/AuthContext"; 

export default function ResetPassword () {
  const { user } = useAuth();
      
  if (user) return <Navigate to="/timeline" replace />;
    
  return (
    <main className='flex min-h-screen bg-[#F7F7F7]'>
      <ResetForm  />
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
