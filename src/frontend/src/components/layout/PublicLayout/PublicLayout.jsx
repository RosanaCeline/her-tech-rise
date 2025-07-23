import React from 'react';

import PublicHeader from "../Header/Public/PublicHeader";
import Footer from "../Footer/Footer";
import { useAuth } from "../../../context/AuthContext"; 

import { Outlet, Navigate } from "react-router-dom";

export default function PublicLayout() {
  const { user } = useAuth();
  
    if (user) 
      return <Navigate to="/timeline" replace />;

  return (
    <>
      <PublicHeader />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
