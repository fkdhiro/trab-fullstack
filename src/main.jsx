import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx';
import { PersonagensProvider } from './contexts/PersonagensContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PersonagensProvider>
      <App />
    </PersonagensProvider>
  </StrictMode>,
);
