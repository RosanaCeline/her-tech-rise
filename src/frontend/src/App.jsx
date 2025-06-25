import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <>
      <h1 className='text-red-500'>Hello world</h1>
      <Router>
        <AppRoutes />
      </Router>
    </>
  )
}