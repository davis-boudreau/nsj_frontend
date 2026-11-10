import L from 'leaflet';
import { maplibreGL } from '@maplibre/maplibre-gl-leaflet';
import { setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'leaflet/dist/leaflet.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import { themedMapStyle } from './map-style.js';

setWorkerUrl(workerUrl);
let mapInstance = null;
let vectorMap = null;
let styleReady = false;
let resizeTimer;

function currentStyle() {
  const css = getComputedStyle(document.documentElement);
  return themedMapStyle(name => css.getPropertyValue(name).trim());
}

function applyMapTheme() {
  if (!vectorMap || !styleReady) return;
  for (const layer of currentStyle().layers) {
    for (const [property, value] of Object.entries(layer.paint || {})) {
      vectorMap.setPaintProperty(layer.id, property, value);
    }
  }
}

window.addEventListener('themeChanged', applyMapTheme);

export function destroyNSMap() {
  clearTimeout(resizeTimer);
  mapInstance?.remove();
  mapInstance = null;
  vectorMap = null;
  styleReady = false;
}

export function initNSMap(mapData = []) {
  destroyNSMap();
  const mapElement = document.getElementById('ns-journey-map');
  if (!mapElement) return;

  const map = mapInstance = L.map(mapElement, {
    scrollWheelZoom: false,
    zoomControl: true,
    dragging: !L.Browser.mobile,
    maxZoom: 18,
  }).setView([45.0, -63.0], 7);

  try {
    const layer = maplibreGL({
      style: currentStyle(),
      attribution: '<a href="https://openfreemap.org/">OpenFreeMap</a> | ' +
        '<a href="https://www.openmaptiles.org/">OpenMapTiles</a> | ' +
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    vectorMap = layer.getMaplibreMap();
    // A theme may change while the initial style is still loading.
    vectorMap.on('style.load', () => {
      styleReady = true;
      applyMapTheme();
    });
  } catch (error) {
    console.error('Vector basemap could not start', error);
    const message = document.createElement('p');
    message.className = 'map-error';
    message.setAttribute('role', 'status');
    message.textContent = 'The map could not load. Check that WebGL is enabled in your browser.';
    mapElement.append(message);
  }

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
        .bindPopup(() => {
          const popup = document.createElement('div');
          const title = document.createElement('strong');
          title.textContent = point.title;
          popup.append(title, document.createElement('br'), document.createTextNode(point.desc || ''));
          return popup;
        });
    });
  } else {
    // Your default "Discovery" markers
    L.marker([44.6510, -63.5827], { icon: nsccIcon }).addTo(map).bindPopup(`Default Point`);
  }

  resizeTimer = setTimeout(() => map.invalidateSize(), 250);
}