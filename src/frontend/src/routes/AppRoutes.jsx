import { useNavigate } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRoutesByRole, publicRoutes, authRoutes } from './listRoutes';

import PublicLayout from "../components/layout/PublicLayout/PublicLayout"
import PrivateLayout from "../components/layout/PrivateLayout/PrivateLayout"
import NotFound from '../pages/NotFound/NotFound'
import { useEffect } from 'react';

export default function AppRoutes() {
  const { user, logout } = useAuth()
  const navigate = useNavigate();
  const tipoUsuario = user?.role
  const privateRoutes = getRoutesByRole(tipoUsuario || 'profissional', navigate, logout); 

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<PublicLayout />}>
        {publicRoutes.map(({ path, element, title }) => (
          <Route key={path} path={path} 
                element={
                  <RouteWithTitle
                    title={title}
                    element={element}
                  />
                } 
          />
        ))}
      </Route>

      {/* Rotas de autenticação */}
      {authRoutes.map(({ path, element, title }) => (
        <Route key={path} path={path} 
              element={
                <RouteWithTitle
                  title={title}
                  element={element}
                />
              } 
        />
      ))}

      {/* Rotas privadas */}
      <Route element={<PrivateLayout routes={privateRoutes} />}>
        {privateRoutes
          .map(({ path, element, title }) => (
            <Route key={path} path={path} 
                  element={
                    <RouteWithTitle
                      title={title}
                      element={element}
                    />
                  }
            />
        ))}
      </Route>

      <Route path="*" element={<NotFound />} />

    </Routes>
  )
}

function RouteWithTitle({ element, title }) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | Her Tech Rise`;
    }
  }, [title]);

  return element;
}