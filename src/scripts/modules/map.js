import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

let mapInstance = null; // Track the map globally in this module

// modules/map.js

window.addEventListener('themeChanged', () => {
  // Simplest way: Re-init the map or swap the tile layer
  // For an SPA, calling initNSMap() again (after clearing the old map) works best.
  if (document.getElementById('ns-journey-map')) {
     // Logic to remove old map instance and re-init
  }
});

// modules/map.js

/**
 * modules/map.js
 * Handles Leaflet initialization and theme-aware marker rendering
 */

export function initNSMap(mapData = []) {
  // 1. Target the actual map ID, not the text container
  const mapElement = document.getElementById('ns-journey-map');
  if (!mapElement) return;

  // 2. Clear existing instance for SPA navigation
  if (mapElement._leaflet_id) {
    mapElement._leaflet_id = null;
    mapElement.innerHTML = "";
  }

  const map = L.map('ns-journey-map', {
    scrollWheelZoom: false,
    zoomControl: true,
    dragging: !L.Browser.mobile,
    tap: !L.Browser.mobile
  }).setView([45.0, -63.0], 7);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  // Icons (keep your existing var(--primary) and var(--accent) logic)
  const nsccIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div class="marker-pin shadow-lg" style="background-color: var(--primary);"></div>`,
    iconSize: [30, 42], iconAnchor: [15, 42]
  });

  const communityIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div class="marker-pin shadow-lg" style="background-color: var(--accent);"></div>`,
    iconSize: [30, 42], iconAnchor: [15, 42]
  });

  // 3. Logic to handle dynamic data
  // If mapData is passed, loop through it; otherwise use defaults
  if (mapData.length > 0) {
    mapData.forEach(point => {
      L.marker([point.lat, point.lng], { icon: point.type === 'nscc' ? nsccIcon : communityIcon })
        .addTo(map)
        .bindPopup(`<strong>${point.title}</strong><br>${point.desc}`);
    });
  } else {
    // Your default "Discovery" markers
    L.marker([44.6510, -63.5827], { icon: nsccIcon }).addTo(map).bindPopup(`Default Point`);
  }

  setTimeout(() => map.invalidateSize(), 250);
}