import React from 'react';
import LandingPage from "../pages/LandingPage/LandingPage";
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import ResetPassword from "../pages/Register/ResetPassword/ResetPassword"

export const publicRoutes = [
    { path: '/', element: <LandingPage />}
];

export const authRoutes = [
    { path: '/login', element: <Login /> },
    { path: '/cadastro', element: <Register /> },
    { path: '/redefinirsenha', element: <ResetPassword /> },
];


export const privateRoutes = [
    // { path: '/timeline', element: <Timeline /> },
]