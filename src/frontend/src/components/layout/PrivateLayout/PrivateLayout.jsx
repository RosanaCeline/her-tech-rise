import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";  

import PrivateHeader from "../Header/Private/PrivateHeader";
import Footer from "../Footer/Footer";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";

export default function PrivateLayout({ routes }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PrivateHeader routes={routes} />
      <main className="flex-1 pt-25 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}