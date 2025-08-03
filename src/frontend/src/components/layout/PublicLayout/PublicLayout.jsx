import React from 'react';

import PublicHeader from "../Header/Public/PublicHeader";
import Footer from "../Footer/Footer";
import { useAuth } from "../../../context/AuthContext"; 

import { Outlet, useNavigate } from "react-router-dom";

export default function PublicLayout() {
  const { user } = useAuth();
  const navigate = useNavigate()

  if (user) return navigate('/timeline');

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