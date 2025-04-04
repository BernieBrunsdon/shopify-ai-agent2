import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/components/App';
import '@/styles/index.css';
const container = document.getElementById('root');
const root = createRoot(container);
root.render(_jsx(React.StrictMode, { children: _jsx(App, {}) }));


// main.js
if (window.__MY_APP_LOADED__) {
    console.warn('App already loaded!');
  } else {
    window.__MY_APP_LOADED__ = true;
    // Your actual app initialization
  }
