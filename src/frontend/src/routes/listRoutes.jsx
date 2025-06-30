import React from 'react';
import LandingPage from "../pages/LandingPage/LandingPage";

import Login from '../pages/Auth/Login/Login';
import Register from '../pages/Auth/Register/Register';
import ResetPassword from "../pages/Auth/ResetPassword/ResetPassword"

import Timeline from '../pages/Timeline/Timeline';
import VerMeuPerfil from '../pages/User/VerMeuPerfil';

import { logout } from '../services/authService';

// import ListarComunidades from '../pages/Communities/CommunityList';
// import UListarVagas from '../pages/Vacancies/User/UserListarVagas';
// import UListarCursos from '../pages/Courses/User/UserListarCursos';

const handleLogout = () => {
  logout()
  window.location.href = '/login'
}

import { Home, Users, Briefcase, BookOpen, User, LogOut } from 'lucide-react';
const iconSize = 20;

export const publicRoutes = [
    { path: '/', element: <LandingPage registerPath="/cadastro" />}
];

export const authRoutes = [
    { path: '/login', element: <Login resetPass="/redefinirsenha" registerPath="/cadastro" enter="/timeline"/> },
    { path: '/cadastro', element: <Register /> },
    { path: '/redefinirsenha', element: <ResetPassword /> },
];

export const privateRoutes = [
  { path: '/timeline',          element: <Timeline />,      title: 'Pagina Inicial',      visible: true,  icon: <Home size={iconSize} /> },
//   { path: '/listarcomunidades', element: <ListarComunidades />,   title: 'Comunidades',   visible: true,  icon: <Users size={iconSize} /> },
//   { path: '/listarvagas',       element: <UListarVagas />,  title: 'Vagas',         visible: true,  icon: <Briefcase size={iconSize} /> },
//   { path: '/listarcursos',      element: <UListarCursos />, title: 'Cursos',        visible: true,  icon: <BookOpen size={iconSize} /> },
  { path: '/meuperfil',     element: <VerMeuPerfil />, title: 'Perfil',        visible: true,  icon: <User size={iconSize} /> },
  { title: 'Sair',              visible: true,              icon: <LogOut size={iconSize} />,       action: () => { handleLogout() } }
];


export const privateRoutesEnterprise = [
    { path: '/timeline',          element: <Timeline />,      title: 'Pagina Inicial',      visible: true,  icon: <Home size={iconSize} /> },
    { path: '/meuperfil',     element: <VerMeuPerfil />, title: 'Perfil',        visible: true,  icon: <User size={iconSize} /> },
    // { path: '/minhasvagas', element: <VagasEmpresa /> },
    // { path: '/meuscursos', element: <CursosEmpresa /> },
    { title: 'Sair',              visible: true,              icon: <LogOut size={iconSize} />,       action: () => { handleLogout() } }
]

export function getRoutesByRole(tipoUsuario) {
    if (tipoUsuario === 'enterprise') return privateRoutesEnterprise;
    return privateRoutes; 
}