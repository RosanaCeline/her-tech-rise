import React from 'react';

import PrivateHeader from "../Header/Private/PrivateHeader";
import Footer from "../Footer/Footer";

import { Outlet } from "react-router-dom";

export default function PrivateLayout() {
  return (
    <>
      <PrivateHeader />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
