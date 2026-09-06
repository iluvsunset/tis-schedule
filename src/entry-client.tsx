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

// Clean up any SSR placeholder comment left over
const hasRealDOM = rootElement.firstElementChild !== null && !rootElement.innerHTML.includes('<!--ssr-outlet-->');
const isDev = import.meta.env.DEV;
const ssrRoute = rootElement.getAttribute('data-ssr-route');
const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

// Hydration is only valid when:
// 1. Not running in Vite dev mode (Vite serves raw index.html without SSR pre-render)
// 2. We actually have pre-rendered HTML DOM nodes inside #root
// 3. The current browser route matches the route pre-rendered into this HTML file
const isMatchingRoute = ssrRoute ? (ssrRoute === currentPath || (ssrRoute === '/' && currentPath === '/vi/11-tn')) : true;
const canHydrate = !isDev && hasRealDOM && isMatchingRoute;

if (canHydrate) {
  try {
    ReactDOM.hydrateRoot(
      rootElement,
      <BrowserRouter>
        <App />
      </BrowserRouter>,
      {
        onRecoverableError(error) {
          // Log recoverable hydration discrepancies (e.g. clock differences) without crashing
          console.warn('Hydration recoverable notice:', error);
        },
      }
    );
  } catch (err) {
    console.warn('Hydration failed, gracefully falling back to client render:', err);
    rootElement.innerHTML = '';
    ReactDOM.createRoot(rootElement).render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
  }
} else {
  // If in dev mode or route does not match SSR pre-rendered content, render cleanly via createRoot
  if (rootElement.firstElementChild === null || !canHydrate) {
    rootElement.innerHTML = '';
  }
  ReactDOM.createRoot(rootElement).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
}
