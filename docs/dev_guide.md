# 🚀 NS Journey: Frontend Developer Guide

This document governs the management of our **v0.9 Modular Frontend** and provides solutions for common "gotchas" in our Vite/Tailwind environment.

## 🛠️ Core Commands

Run these from the repository root:

* **`npm install`**: Installs all dependencies. Run this after every `git pull`.
* **`npm run dev`**: Starts the local development server with Hot Module Replacement (HMR).
* **`npm run build`**: Compiles the project into the `/dist` folder for the Azure server.

---

## 🔍 Troubleshooting Guide

### ⚡ 1. The "Vite Reset" (Fixes most CSS/Map issues)

If styles aren't updating or the map is acting strangely, the Vite cache may be stale. Run this sequence:

```bash
# 1. Stop the terminal (Ctrl + C)
# 2. Delete the hidden Vite cache folder
rm -rf node_modules/.vite
# 3. Restart the server
npm run dev

```

Reset with Preview Mode

```bash
rm -rf dist node_modules/.vite && npm run build && npm run preview
```

### 🎨 2. Styles are not appearing

If you see raw CSS code (`@tailwind base`) or unstyled text:

* **PostCSS Check:** Ensure `postcss.config.js` exists in the root folder.
* **The Import:** Verify `import '../styles/base.css';` is at the very top of `src/scripts/main.js`.
* **Content Paths:** Ensure `tailwind.config.js` includes `./src/**/*.{html,js}` in its content array.

### 🗺️ 3. Map is invisible (0px Height)

Leaflet requires an explicit height to render. If the map is "gone":

* **Tailwind Check:** Ensure the map div has the class `h-[500px]`.
* **Fallback:** If Tailwind is failing, use `style="height: 500px; width: 100%;"` for debugging.

### 📁 4. "404 Not Found" on Webparts

* **Case Sensitivity:** Azure/Linux servers are case-sensitive. `Webparts` is not the same as `webparts`.
* **Relative Paths:** Ensure your `injectPart` calls use absolute paths from the `src` root (e.g., `/webparts/hero/hero.html`).

---

## Move from messy utility classes to a structured design system
Design System
tokens
brand steps
neutral steps
semantic 

SPA (Single-Page Application)
Pure JS SPA routing
History API (pushState, popstate) → for clean URLs
localStorage / sessionStorage → for caching
Fetch API → for calling backend APIs
DOM APIs → to swap UI sections
Vite build tools


A Smart Injector that prevents UI flashing.

A spinner when webparts are loading

A Loading Sequence that keeps the footer at the bottom.

A Visual Progress System for user feedback.

A Diagnostic System that tells you exactly where any "ghosts" are hiding.

A Toast notification System

Component CSS + Tailwind to reduce maintenance.

Dark and light theme

Mobile support
Web-based Cross‑platform
(Useful for people with strong HTML/CSS/JS skills!)
✔️ Capacitor (modern)



Leaflet
Dynamic Pins: By using background-color: var(--primary), the markers will automatically update their shade if you ever change your brand palette.

Mobile Friendly: Added dragging: !L.Browser.mobile so users don't get stuck while scrolling down the page on a phone.

Popup Branding: I injected var(--primary) and var(--accent) directly into the bindPopup strings so the text inside the map matches the text on your page.

Instant Theming: Since we are using standard tiles, the CSS filter you already have in base.css will recolor these OSM tiles to "Midnight Blue" the second you hit the toggle.



Troubleshooting

Verification Step (The Console Test)
To prove the filter works, you can force it via the browser console. Open your site, press F12, go to the Console tab, and paste this:

JavaScript
document.querySelector('#ns-journey-map').style.filter = 'invert(100%) hue-rotate(180deg)';

document.querySelector('#ns-journey-map').style.filter = 'invert(100%) hue-rotate(165deg)';

// Force the whole site into Dark Mode to see your CSS transition
document.documentElement.setAttribute('data-theme', 'dark');

// Force the whole site into Light Mode
document.documentElement.setAttribute('data-theme', 'light');

