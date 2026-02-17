import { Outlet } from "react-router-dom";

import PublicHeader from "../Header/Public/PublicHeader";
import Footer from "../Footer/Footer";

export default function PublicLayout() {
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