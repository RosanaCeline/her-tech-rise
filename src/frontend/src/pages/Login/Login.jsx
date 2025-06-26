import React from 'react';
import LoginForm from './components/LoginForm'
import logo from "../../assets/logo/LogoNamePurple.png";
import login from "../../assets/homepage/login.png";

export default function Login () {
  return (
    <main className='flex bg-[#F7F7F7]'>
      <LoginForm/>
      <div className='w-1/2 flex flex-col justify-center p-4'>
        <img src={logo} alt="Logo Her Tech Rise" className='w-xl mx-auto'/>
        <img src={login} alt="Imagem ilustrativa de login" className='w-xl mx-auto'/>
      </div>
    </main>
  )
}