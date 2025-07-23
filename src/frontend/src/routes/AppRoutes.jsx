import React from 'react';
import { useNavigate } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRoutesByRole 
        , publicRoutes, authRoutes } from './listRoutes';

import PublicLayout from "../components/layout/PublicLayout/PublicLayout"
import PrivateLayout from "../components/layout/PrivateLayout/PrivateLayout"

export default function AppRoutes() {
  const { user } = useAuth()
  const navigate = useNavigate();
  const tipoUsuario = user?.tipo_usuario
  const privateRoutes = getRoutesByRole(tipoUsuario || 'profissional', navigate); 

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