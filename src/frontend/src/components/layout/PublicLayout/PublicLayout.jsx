import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";  

import PublicHeader from "../Header/Public/PublicHeader";
import Footer from "../Footer/Footer";

export default function PublicLayout() {

  const { user, loading } = useAuth();
  if (loading) return null;
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
