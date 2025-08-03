import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";  
import { useEffect } from 'react'

import PrivateHeader from "../Header/Private/PrivateHeader";
import Footer from "../Footer/Footer";

export default function PrivateLayout({ routes }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate()

   useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading || !user) return <div>Carregando...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <PrivateHeader routes={routes} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}