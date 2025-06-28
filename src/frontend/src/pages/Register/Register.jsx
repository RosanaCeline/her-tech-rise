import React from 'react';
import RegisterForm from './components/RegisterForm';
import logo from "../../assets/logo/LogoNamePurpleAction.png";
import register from "../../assets/auth/register.png";

export default function Register () {
  return (
    <main className='flex bg-[#F7F7F7]'>
      <div className='hidden md:w-1/2 md:flex md:flex-col justify-center p-4'> 
        <img src={logo} alt="Logo Her Tech Rise" className='w-7/8 mx-auto'/>
        <p className='text-5xl font-bold text-center text-(--purple-action) mt-5'>Faça seu cadastro!*</p>
        <p className='text-lg text-center text-(--purple-action)'>Mais que uma conta. São conexões que fazem a diferença.</p>
        <img src={register} alt="Imagem ilustrativa de login" className='w-2/3 mx-auto'/>
      </div>
      <RegisterForm/>
    </main>
  )
}