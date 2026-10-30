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
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-[var(--light)] focus:text-[var(--purple-primary)] focus:font-semibold"
      >
        Pular para o conteúdo
      </a>
      <PublicHeader />
      <main id="conteudo" tabIndex={-1} className="flex-grow bg-[var(--light)] focus:outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
