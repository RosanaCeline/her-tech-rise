import React from 'react';

import PublicHeader from "../Header/Public/PublicHeader";
import Footer from "../Footer/Footer";
import { useAuth } from "../../../context/AuthContext"; 

import { Outlet, Navigate } from "react-router-dom";

export default function PublicLayout() {
  const { user } = useAuth();

  if (user) return <Navigate to="/timeline" replace />;

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