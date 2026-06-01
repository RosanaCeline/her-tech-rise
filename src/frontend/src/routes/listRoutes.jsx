import { lazy } from 'react';
import { Home, User, LogOut, BriefcaseBusiness } from 'lucide-react';

const LandingPage             = lazy(() => import('../pages/LandingPage/LandingPage'));
const Login                   = lazy(() => import('../pages/Auth/Login/Login'));
const Register                = lazy(() => import('../pages/Auth/Register/Register'));
const ResetPassword           = lazy(() => import('../pages/Auth/ResetPassword/ResetPassword'));
const NewPassword             = lazy(() => import('../pages/Auth/ResetPassword/NewPassword'));
const Timeline                = lazy(() => import('../pages/Timeline/Timeline'));
const VerMeuPerfil            = lazy(() => import('../pages/User/VerMeuPerfil'));
const VerPerfil               = lazy(() => import('../pages/User/VerPerfil'));
const SearchUser              = lazy(() => import('../pages/Search/SearchUser'));
const ProfessionalJobsListing = lazy(() => import('../pages/JobsListing/ProfessionalJobsListing'));
const CompanyJobsListing      = lazy(() => import('../pages/JobsListing/CompanyJobsListing'));
const ProfessionalApplications = lazy(() => import('../pages/applications/ProfessionalApplications'));
const CompanyApplications     = lazy(() => import('../pages/applications/CompanyApplications'));

const iconSize = 20;

export const publicRoutes = [
    { path: '/', element: <LandingPage registerPath="/cadastro" />}
];

export const authRoutes = [
    { path: '/login', element: <Login resetPass="/redefinirsenha" registerPath="/cadastro" enter="/timeline"/>, title: 'Login' },
    { path: '/cadastro', element: <Register />, title: 'Cadastro' },
    { path: '/redefinirsenha', element: <ResetPassword />, title: 'Redefinir Senha' },
    { path: '/redefinirnovasenha', element: <NewPassword/>, title: 'Nova Senha'},
];

export function getRoutesByRole(tipoUsuario, navigate, logout) {
  const handleLogout = () => {
    logout()
    // navigate('/login', { replace: true })
  };

  if (tipoUsuario === 'COMPANY') 
    return [
      { path: '/timeline',                      element: <Timeline />,          title: 'Início',                  visible: true,           icon: <Home size={iconSize} /> },
      { path: '/empresa/vagas',                 element: <CompanyJobsListing/>, title: 'Vagas',                   icon: <BriefcaseBusiness size={iconSize} />},
      { path: '/meuperfil',                     element: <VerMeuPerfil />,      title: 'Perfil',                  visible: true,           icon: <User size={iconSize} /> },
      { title: 'Sair',                          visible: true,                  icon: <LogOut size={iconSize} />, action: () => { handleLogout() } },
      { path: '/search',                        element: <SearchUser/> },
      { path: '/profile/:user_type/:user_info', element: <VerPerfil />,         title: 'Perfil',                  visible: false },  
      { path: '/empresa/vagas/:id',             element: <CompanyApplications/> },
    ];
  else
    return [
      { path: '/timeline',                      element: <Timeline />,               title: 'Início',         visible: true,           icon: <Home size={iconSize} /> },
      { path: '/profissional/vagas',            element: <ProfessionalJobsListing/>, title: 'Vagas',          icon: <BriefcaseBusiness size={iconSize} />},
      { path: '/meuperfil',                     element: <VerMeuPerfil />,           title: 'Perfil',         visible: true,           icon: <User size={iconSize} /> },
      { title: 'Sair',                          visible: true,                       icon: <LogOut size={iconSize} />,                 action: () => { handleLogout() } },
      { path: '/search',                        element: <SearchUser/> },
      { path: '/profile/:user_type/:user_info', element: <VerPerfil />,              title: 'Perfil',         visible: false },
      { path: '/profissional/vagas/candidaturas', element: <ProfessionalApplications/> },
    ];
}