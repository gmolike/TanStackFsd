import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '~/app/app';

import './app/styles/main.css';

// Sicherstellen, dass das root Element existiert
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// React 18+ API verwenden
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
