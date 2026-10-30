import RegisterForm from './components/RegisterForm';
import logo from "../../../assets/logo/LogoNamePurpleAction.png";
import register from "../../../assets/auth/register.png";

// import { useAuth } from "../../../context/AuthContext"; 
// import { Navigate } from "react-router-dom";

export default function Register () {

  // const { user } = useAuth();
  // if (user) return <Navigate to="/timeline" replace />;
  
  return (
    <main className='flex min-h-screen bg-[#F7F7F7]'>
      <div className='hidden md:w-1/2 md:flex md:flex-col justify-center p-4'> 
        <img src={logo} alt="Her Tech Rise" width="1366" height="210" className='w-7/8 h-auto mx-auto'/>
        <p className='text-4xl lg:text-5xl font-bold text-center text-(--purple-action) mt-5'>Faça seu cadastro!</p>
        <p className='text-lg text-center text-(--purple-action)'>Mais que uma conta. São conexões que fazem a diferença.</p>
        <img src={register} alt="" width="2000" height="2000" className='w-2/3 h-auto mx-auto'/>
      </div>
      <RegisterForm/>
    </main>
  )
}