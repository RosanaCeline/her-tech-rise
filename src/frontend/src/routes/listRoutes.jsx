import React from 'react';
import LandingPage from "../pages/LandingPage/LandingPage";

import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import ResetPassword from "../pages/ResetPassword/ResetPassword"

import Timeline from '../pages/Timeline/Timeline';
import ListarComunidades from '../pages/Communities/ListarComunidades';
import UListarVagas from '../pages/Vacancies/User/UserListarVagas';
import UListarCursos from '../pages/Courses/User/UserListarCursos';
import UVerMeuPerfil from '../pages/Profile/User/UserVerMeuPerfil';

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
  { path: '/listarcomunidades', element: <ListarComunidades />,   title: 'Comunidades',   visible: true,  icon: <Users size={iconSize} /> },
  { path: '/listarvagas',       element: <UListarVagas />,  title: 'Vagas',         visible: true,  icon: <Briefcase size={iconSize} /> },
  { path: '/listarcursos',      element: <UListarCursos />, title: 'Cursos',        visible: true,  icon: <BookOpen size={iconSize} /> },
  { path: '/meuperfil/:id',     element: <UVerMeuPerfil />, title: 'Perfil',        visible: true,  icon: <User size={iconSize} /> },
  { title: 'Sair',              visible: true,              icon: <LogOut size={iconSize} />,       action: () => { window.location.href = '/login'; } }
];


export const privateRoutesEnterprise = [
    { path: '/timeline', element: <Timeline /> },
    // { path: '/minhasvagas', element: <VagasEmpresa /> },
    // { path: '/meuscursos', element: <CursosEmpresa /> },
    // { path: '/meuperfilempresarial/:id', element: <PerfilEmpresa /> },
]