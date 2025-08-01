import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import App from './App.jsx';

const appStartedKey = 'appHasStartedBefore'
if (!localStorage.getItem(appStartedKey)) {
  localStorage.clear()
  localStorage.setItem(appStartedKey, 'true') 
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
