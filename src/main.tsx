/* eslint-disable no-restricted-imports */
import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from '~/app/app';
import '../src/app/styles/global.css';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootElement = document.getElementById('app')!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
