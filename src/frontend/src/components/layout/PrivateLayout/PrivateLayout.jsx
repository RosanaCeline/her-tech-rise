import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";  

import PrivateHeader from "../Header/Private/PrivateHeader";
import Footer from "../Footer/Footer";

export default function PrivateLayout({ routes }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate()

  if (loading) return <div>Carregando...</div>;
  if (!user) return navigate('/login')

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