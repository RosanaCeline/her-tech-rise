import LandingPage from "../pages/LandingPage/LandingPage";

import Login from '../pages/Auth/Login/Login';
import Register from '../pages/Auth/Register/Register';
import ResetPassword from "../pages/Auth/ResetPassword/ResetPassword"
import NewPassword from "../pages/Auth/ResetPassword/NewPassword"

import Timeline from '../pages/Timeline/Timeline';
import VerMeuPerfil from '../pages/User/VerMeuPerfil';
import VerPerfil from '../pages/User/VerPerfil';
import SearchUser from '../pages/Search/SearchUser';
import { logout } from '../services/authService';

import { Home, User, LogOut, BriefcaseBusiness } from 'lucide-react';
import ProfessionalJobsListing from "../pages/JobsListing/ProfessionalJobsListing";
import CompanyJobsListing from "../pages/JobsListing/CompanyJobsListing";

const iconSize = 20;

export const publicRoutes = [
    { path: '/', element: <LandingPage registerPath="/cadastro" />}
];

export const authRoutes = [
    { path: '/login', element: <Login resetPass="/redefinirsenha" registerPath="/cadastro" enter="/timeline"/> },
    { path: '/cadastro', element: <Register /> },
    { path: '/redefinirsenha', element: <ResetPassword /> },
    { path: '/redefinirnovasenha', element: <NewPassword/>},
];

export function getRoutesByRole(tipoUsuario, navigate) {
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  console.log("Tipo de usuário:", tipoUsuario)


  if (tipoUsuario === 'COMPANY') 
    return [
      { path: '/timeline',          element: <Timeline />,      title: 'Pagina Inicial',      visible: true,  icon: <Home size={iconSize} /> },
      { path: '/empresa/vagas', element: <CompanyJobsListing/>, title: 'Vagas', icon: <BriefcaseBusiness size={iconSize} />},
      { path: '/meuperfil',     element: <VerMeuPerfil />, title: 'Perfil',        visible: true,  icon: <User size={iconSize} /> },
      { title: 'Sair',              visible: true,              icon: <LogOut size={iconSize} />,       action: () => { handleLogout() } },
  ]
  return [
    { path: '/timeline',          element: <Timeline />,      title: 'Pagina Inicial',      visible: true,  icon: <Home size={iconSize} /> },
    { path: '/profissional/vagas', element: <ProfessionalJobsListing/>, title: 'Vagas', icon: <BriefcaseBusiness size={iconSize} />},
    { path: '/meuperfil',     element: <VerMeuPerfil />, title: 'Perfil',        visible: true,  icon: <User size={iconSize} /> },
    { title: 'Sair',              visible: true,              icon: <LogOut size={iconSize} />,       action: () => { handleLogout() } },
    { path: '/search', element: <SearchUser/> },
    { path: '/profile/:user_type/:user_info', element: <VerPerfil />, title: 'Perfil', visible: false },
  ]
}