// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from '~/app/app';

import '../index.css';

// ================= TYPES =================
// Keine spezifischen Typen für main.tsx benötigt

// ================= LOGIC =================
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// ================= RETURN =================
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
