import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './shared/i18n';
import './shared/styles/global.css';
import { App } from './app/App';

const root = document.getElementById('root');
if (root === null) {
  throw new Error('Missing #root element in index.html.');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
