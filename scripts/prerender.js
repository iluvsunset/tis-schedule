import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function prerender() {
  console.log('⚡ Starting TIS Schedule SSR Prerendering...');
  
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
  
  // Render default root route
  const appHtml = render('/');
  console.log(`✓ Server render completed (length: ${appHtml.length} characters)`);
  
  // Inject SSR HTML into template
  const finalHtml = template.replace('<!--ssr-outlet-->', appHtml);
  
  // Copy all client assets to dist root if dist/client is used
  if (clientDir !== distDir) {
    fs.cpSync(clientDir, distDir, { recursive: true });
  }
  
  // Overwrite dist/index.html with the pre-rendered HTML
  const outIndexPath = path.resolve(distDir, 'index.html');
  fs.writeFileSync(outIndexPath, finalHtml, 'utf-8');
  
  console.log(`✓ SSR Pre-rendered HTML successfully written to ${outIndexPath}`);
}

prerender().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
