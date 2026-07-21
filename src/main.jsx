import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const rootEle = document.getElementById('root');
createRoot(rootEle).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
