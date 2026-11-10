# Map styling

The homepage uses Leaflet for interaction and markers, with MapLibre GL rendering
OpenFreeMap vector tiles. No API key is required. Tiles, fonts and sprites require
an internet connection, and the renderer requires WebGL.

`src/scripts/modules/basemap.json` is a snapshot of the OpenFreeMap Liberty style
from https://tiles.openfreemap.org/styles/liberty. Keep its source and asset URLs
when updating it. Attribution remains visible through the Leaflet integration.
Provider documentation: https://openfreemap.org/quick_start/.

Edit the `--map-*` variables in `src/styles/base.css` to tune the palette. Light
and dark pairs use the same HSL hue and saturation, with different lightness.
`map-style.js` applies these colors to semantic layers while retaining the
original geometry filters, zoom settings, label placement and road widths. The
Natural Earth raster layer is omitted so its baked-in colors do not cover the
custom palette at low zoom levels.

Theme changes update paint properties in place, preserving the viewport, markers
and open popups. Map instances are disposed before SPA navigation replaces them.
Avoid CSS filters on the map container: they also recolor controls and markers.
