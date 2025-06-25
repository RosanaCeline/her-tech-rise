import React from 'react';
import { Routes, Route } from 'react-router-dom';

import PublicLayout from "../components/layout/PublicLayout/PublicLayout"
import PrivateLayout from "../components/layout/PrivateLayout/PrivateLayout"

import { publicRoutes, authRoutes, privateRoutes } from './listRoutes';


export default function AppRoutes() {
  return (
    <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<PublicLayout />}>
            {publicRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
            ))}
        </Route>

        {/* Rotas de autenticação - sem layout protegido */}
        {authRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
        ))}

        {/* Rotas privadas */}
        <Route element={<PrivateLayout routes={privateRoutes} />}>
            {privateRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
            ))}
        </Route>

    </Routes>
  );
}