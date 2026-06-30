import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";  

import PrivateHeader from "../Header/Private/PrivateHeader";
import Footer from "../Footer/Footer";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import SessionWarningBanner from "./banner/SessionWarningBanner";

export default function PrivateLayout({ routes }) {
  const { user, loading, sessionWarning } = useAuth();
  const location = useLocation();

  const hideFooter =
  location.pathname.startsWith("/profissional/vagas") ||
  location.pathname.startsWith("/empresa/vagas");

  if (loading) return <LoadingSpinner />;
  if (!user)  return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col">

      {sessionWarning && <SessionWarningBanner />}

      <PrivateHeader routes={routes} />
      <main className="flex-1 pt-22 flex flex-col bg-[var(--light)]">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}