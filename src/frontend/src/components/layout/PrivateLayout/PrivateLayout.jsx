import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; // hook que fornece o user logado

import PrivateHeader from "../Header/Private/PrivateHeader";
import Footer from "../Footer/Footer";

export default function PrivateLayout({ routes }) {
  const { user } = useAuth();

  if (!user) 
    return <Navigate to="/login" replace />;

  return (
    <>
      <PrivateHeader routes={routes}/>
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
