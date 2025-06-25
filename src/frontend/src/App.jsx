import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <>
      <Router>
        <AppRoutes />
      </Router>
    </>
  )
}