/**
 * base.js - Core SPA Logic
 */

let activeLoads = 0;

function updateProgress(status) {
  const bar = document.getElementById('loading-bar');
  if (!bar) return;

  if (status === 'start') {
    activeLoads++;
    // Force visibility
    bar.classList.add('active');
    // If it's the first load, jump to 30%
    if (activeLoads === 1) {
      bar.style.width = '30%';
    } else {
      // If other parts are already loading, nudge it forward
      bar.style.width = '60%';
    }
  } else {
    activeLoads--;
    
    // Safety check to never go below 0
    if (activeLoads <= 0) {
      activeLoads = 0;
      bar.style.width = '100%';
      
      // Wait for the width animation to finish, then fade out
      setTimeout(() => {
        bar.style.opacity = '0';
        setTimeout(() => {
          bar.classList.remove('active');
          bar.style.width = '0%';
          // Reset opacity for the next use
          setTimeout(() => { bar.style.opacity = ''; }, 100);
        }, 400);
      }, 300);
    }
  }
}

export async function injectPart(slotId, path) {
  const slot = document.getElementById(slotId);
  if (!slot) {
    // If the developer called a slot that doesn't exist, 
    // we still need to log it so the bar doesn't hang!
    console.warn(`Slot ID "${slotId}" not found in DOM.`);
    return; 
  }
  console.log(`⏳ Loading: ${path}`); // DEBUG LINE  
  updateProgress('start'); // 🚀 Start bar

  // Only show spinner if the slot is empty (first load)
  if (slot.innerHTML.trim() === '') {
    slot.innerHTML = `<div class="flex justify-center p-12 w-full"><div class="spinner"></div></div>`;
  }

  try {
    // Add a 5-second "Abort" safety so the bar doesn't hang forever
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const response = await fetch(`./${cleanPath}`, { signal: controller.signal });
    
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const html = await response.text();
    slot.innerHTML = html;
    
    console.log(`✅ Finished: ${path}`); // DEBUG LINE
    if (slot.firstElementChild) slot.firstElementChild.classList.add('animate-fade-in');
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`X Timeout: ${path} took too long!`);
    } else {
      console.error(`X Error: ${path}`, error);
    }
  } finally {
    updateProgress('end');
  }
}

export async function initHeader() {
  await injectPart('header-slot', 'components/header.html');
  setupMobileMenu(); // Attach events immediately after injection
}

export async function initFooter() {
  // We load the divider and footer as a single logical unit
  await Promise.all([
    injectPart('divider-slot', 'components/divider.html'),
    injectPart('footer-slot', 'components/footer.html')
  ]);
}

export function initNavigation(callback) {
  window.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    // Check if it's a valid link and internal (same domain)
    // and NOT a hash-link (which the browser handles for scrolling)
    if (link && link.href.startsWith(window.location.origin) && !link.hash) {
      e.preventDefault();
      window.history.pushState({}, '', link.href);
      // Professional Touch: Scroll to top on route change
      window.scrollTo({ top: 0, behavior: 'smooth' });
      callback();
    }
  });

  window.addEventListener('popstate', callback);
}

export function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);
}

export function toggleTheme() {
  const root = document.documentElement; // This is the <html> tag
  const current = root.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  
  root.setAttribute('data-theme', next); // Must match [data-theme='dark'] in CSS
  localStorage.setItem('theme', next);
  
  // Optional: if you have a map active, give it a nudge
  if (document.getElementById('ns-journey-map')) {
    window.dispatchEvent(new CustomEvent('themeChanged'));
  }
}

export function setupMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');

  if (btn && drawer) {
    btn.onclick = (e) => {
      e.stopPropagation();
      drawer.classList.toggle('hidden');
    };

    const drawerLinks = drawer.querySelectorAll('a');
    drawerLinks.forEach(link => {
      link.onclick = () => drawer.classList.add('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!drawer.contains(e.target) && !btn.contains(e.target)) {
        drawer.classList.add('hidden');
      }
    });
  }
}

export function updateActiveLinks() {
  const currentPath = window.location.pathname;
  // Select all our specific nav-links
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    // Get path from the href attribute specifically
    const linkPath = link.getAttribute('href');
    
    // Check for exact match
    const isActive = (currentPath === linkPath) || 
                     (currentPath === '/index.html' && linkPath === '/');

    if (isActive) {
      link.classList.add('nav-link-active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('nav-link-active');
      link.removeAttribute('aria-current');
    }
  });
}

