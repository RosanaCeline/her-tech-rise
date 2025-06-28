import React from 'react';
import ResetForm from './components/ResetForm'
import logo from "../../../assets/logo/LogoNamePurple.png";
import login from "../../../assets/auth/login.png";

export default function ResetPassword () {
    return (
    <main className='flex bg-[#F7F7F7]'>
      <ResetForm  />
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

