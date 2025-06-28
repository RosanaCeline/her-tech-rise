import React from 'react';
import { Outlet } from "react-router-dom";

import PrivateHeader from "../Header/Private/PrivateHeader";
import Footer from "../Footer/Footer";

export default function PrivateLayout({ routes }) {
  return (
    <>
      <PrivateHeader routes={routes}/>
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
