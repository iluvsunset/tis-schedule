import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import './index.css';

// Register Service Worker for Notifications
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.log('Service Worker registration skipped/failed:', err);
    });
  });
}

const rootElement = document.getElementById('root')!;

// Clear static prerender DOM and mount cleanly with createRoot.
// This prioritizes the cinematic intro video on startup and permanently eliminates any React #418/#423 hydration notices.
rootElement.innerHTML = '';
ReactDOM.createRoot(rootElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
