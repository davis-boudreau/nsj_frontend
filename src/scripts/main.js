/**
 * main.js - Application Entry Point
 */
import '/src/styles/base.css';
import { 
  injectPart, 
  initHeader,
  initFooter,
  setupMobileMenu, 
  initNavigation, 
  toggleTheme, 
  initTheme,
  updateActiveLinks
} from './core/base.js';

import { initNSMap } from './modules/map.js';

async function bootstrap() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  
  // 1. Define your valid routes
  const isHome = path === '/' || path === '/index.html' || path === '';
  const isLogin = path === '/login';
  const pages = {
    '/myjourney': ['myjourney', 'My Journey'],
    '/learnmore': ['learnmore', 'Learn More'],
    '/join': ['join', 'Join'],
    '/reset-password': ['reset-password', 'Password Help'],
  };

  // 2. Clear previous content and load the Shell (if needed)
  // For the 404 or Home, we usually want the standard layout container
  if (isHome || !isLogin) {
    await injectPart('main-content', 'components/main.html');
    document.title = "Home | NS Journey";
  }

  // 3. The Route Switch
  if (isLogin) {
    await injectPart('main-content', 'webparts/login/login.html');
    document.title = "Login | NS Journey";
  } 
  else if (isHome) {
    await Promise.all([
      injectPart('hero-text-slot', 'webparts/hero/hero.html'),
      injectPart('hero-image-slot', 'webparts/hero/heroimage.html'),
      injectPart('discovery-text-slot', 'webparts/discovery/discovery.html'),
      injectPart('map-slot', 'webparts/discovery/map.html') // Injects the <div id="ns-journey-map">
    ]);

    if (typeof initNSMap === 'function') {
      // You can now pass specific data for the Home page
      const homeData = [
        { lat: 44.6510, lng: -63.5827, type: 'nscc', title: 'IT Campus', desc: 'Halifax' }
      ];
      initNSMap(homeData);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 200);
    }
  }
  else if (pages[path]) {
    const [file, title] = pages[path];
    await injectPart('main-content', `webparts/pages/${file}.html`);
    document.title = `${title} | NS Journey`;
  }
  else {
    // 404 CONDITION: No route matched
    await handle404();
    document.title = "404 - Page Not Found";
  }

  // NEW: Update nav styling based on the new route
  updateActiveLinks();
  
  setupMobileMenu(); 
  if (window.location.hash) {
    document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
  }
}

/**
 * Handles rendering the 404 state
 */
async function handle404() {
  // We can either inject a specific HTML file or set a professional message directly
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <section class="container mx-auto px-6 py-32 text-center animate-fade-in">
      <h1 class="text-9xl font-black text-brand-100 dark:text-neutral-800">404</h1>
      <div class="relative -mt-20">
        <h2 class="text-4xl font-bold mb-4">Lost in Transit?</h2>
        <p class="text-xl text-muted max-w-md mx-auto mb-8">
          The page you're looking for has taken a detour. Let's get you back on the right route.
        </p>
        <a href="/" class="btn-primary inline-flex">Return to Home</a>
      </div>
    </section>
  `;
}

async function startApp() {
  console.log("App starting...");
  
  // A. Set Initial State
  initTheme(); 
  
  // B. LOAD SEQUENCE:
  // 1. Header first (Top of screen)
  await initHeader(); 

  // 2. Main content (Center of screen)
  // This takes the longest, so the spinner will show here
  await bootstrap(); 

  // 3. Footer last (Bottom of screen)
  // This prevents the footer from "flashing" in the middle
  await initFooter();

  // C. Enable SPA routing
  initNavigation(bootstrap); 
}

// Expose theme toggle for HTML onclick attributes
window.toggleTheme = toggleTheme;

// Launch
startApp();
