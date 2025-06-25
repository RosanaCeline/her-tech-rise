import React from 'react';

import PublicHeader from "../Header/Public/PublicHeader";
import Footer from "../Footer/Footer";

import { Outlet } from "react-router-dom";

export default function PublicLayout() {
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
