import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const ROUTES_TO_PRERENDER = [
  '/',
  '/11-tn',
  '/11.1-tn',
  '/11.2-xh',
  '/10-tn',
  '/10.1-tn',
  '/10-nt',
  '/10.2-nt',
  '/12-tn',
  '/6',
  '/7',
  '/8',
  '/9',
  '/room/504',
  '/room/504/live',
  '/room/503',
  '/room/503/live',
  '/room/4012',
  '/room/4012/live',
  '/room/307',
  '/room/307/live',
  '/room/4010',
  '/room/4010/live',
  '/room/4011',
  '/room/4011/live',
  '/room/501',
  '/room/501/live',
  '/room/502',
  '/room/502/live',
  '/vi/11-tn',
  '/en/11-tn',
  '/vi/11.2-xh',
  '/en/11.2-xh'
];

async function prerender() {
  console.log('⚡ Starting comprehensive TIS Schedule SSR Prerendering...');
  
  const clientDir = path.resolve(rootDir, 'dist/client');
  const serverDir = path.resolve(rootDir, 'dist/server');
  const distDir = path.resolve(rootDir, 'dist');
  
  const templatePath = path.resolve(clientDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found at ${templatePath}`);
  }
  
  const template = fs.readFileSync(templatePath, 'utf-8');
  
  const serverEntryPath = path.resolve(serverDir, 'entry-server.js');
  if (!fs.existsSync(serverEntryPath)) {
    throw new Error(`Server entry not found at ${serverEntryPath}`);
  }
  
  const { render } = await import(pathToFileURL(serverEntryPath).href);
  
  // Copy all client assets to dist root first
  if (clientDir !== distDir) {
    fs.cpSync(clientDir, distDir, { recursive: true });
  }

  let count = 0;
  for (const route of ROUTES_TO_PRERENDER) {
    try {
      const appHtml = render(route);
      const taggedOutlet = `<div id="root" data-ssr-route="${route}">${appHtml}</div>`;
      
      let finalHtml = template;
      if (finalHtml.includes('<div id="root"><!--ssr-outlet--></div>')) {
        finalHtml = finalHtml.replace('<div id="root"><!--ssr-outlet--></div>', taggedOutlet);
      } else {
        finalHtml = finalHtml.replace('<!--ssr-outlet-->', appHtml);
      }

      if (route === '/') {
        const outIndexPath = path.resolve(distDir, 'index.html');
        fs.writeFileSync(outIndexPath, finalHtml, 'utf-8');
      } else {
        const cleanRoute = route.replace(/^\/+|\/+$/g, '');
        const targetDir = path.resolve(distDir, cleanRoute);
        fs.mkdirSync(targetDir, { recursive: true });
        fs.writeFileSync(path.resolve(targetDir, 'index.html'), finalHtml, 'utf-8');
      }
      count++;
    } catch (err) {
      console.warn(`Warning: Failed to prerender route "${route}":`, err);
    }
  }
  
  console.log(`✓ Successfully pre-rendered ${count} routes into static HTML.`);
}

prerender().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
