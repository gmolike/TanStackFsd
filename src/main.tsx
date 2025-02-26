/* eslint-disable no-restricted-imports */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '~/app/app';

import '~/app/styles/global.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} else {
  console.error('Root element not found');
}
