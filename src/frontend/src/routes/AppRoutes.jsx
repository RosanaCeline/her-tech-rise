import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRoutesByRole // vai mandar a lista de rotas certa dependendo do tipo de usuário
        , publicRoutes, authRoutes } from './listRoutes';

import PublicLayout from "../components/layout/PublicLayout/PublicLayout"
import PrivateLayout from "../components/layout/PrivateLayout/PrivateLayout"

export default function AppRoutes() {
  const { user } = useAuth();
  const tipoUsuario = user?.tipo_usuario;
  const privateRoutes = getRoutesByRole(tipoUsuario || 'profissional'); 

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<PublicLayout />}>
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>

      {/* Rotas de autenticação */}
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
  )
}