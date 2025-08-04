import { ErrorProvider } from "./context/ErrorContext";
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
  return (
    <ErrorProvider>
      <Router>
        <AppRoutes />
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </ErrorProvider>
  )
}