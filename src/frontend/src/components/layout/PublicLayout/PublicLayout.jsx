import React from 'react';

import PublicHeader from "../Header/Public/PublicHeader";
import Footer from "../Footer/Footer";
import { useAuth } from "../../../context/AuthContext"; 
import { useEffect } from 'react'

import { Outlet, useNavigate } from "react-router-dom";

export default function PublicLayout() {
  const { user } = useAuth();
  const navigate = useNavigate()

   useEffect(() => {
    if (user) {
      navigate('/timeline');
    }
  }, [user, navigate]);

  // Enquanto redireciona, pode mostrar algo leve
  if (user) return <div>Redirecionando...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}