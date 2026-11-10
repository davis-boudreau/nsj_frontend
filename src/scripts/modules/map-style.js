import basemap from './basemap.json';

// Preserve the provider's source, glyph, sprite, attribution and geometry settings.
// Only paint properties change between themes, so zoom and markers stay in place.
export function themedMapStyle(readColor) {
  const style = structuredClone(basemap);
  style.layers = style.layers.filter(layer => layer.type !== 'raster');
  for (const layer of style.layers) {
    const source = layer['source-layer'];
    const paint = layer.paint ||= {};
    const color = name => readColor(`--map-${name}`);
    if (layer.type === 'background') paint['background-color'] = color('land');
    if (layer.type === 'fill') {
      let key = 'land';
      if (source === 'water') key = 'water';
      else if (source === 'park' || /wood|grass|wetland|cemetery|pitch/.test(layer.id)) key = 'green';
      else if (source === 'building') key = 'building';
      else if (source === 'transportation' || source === 'aeroway') key = 'road';
      paint['fill-color'] = color(key);
      if ('fill-outline-color' in paint) paint['fill-outline-color'] = color(key);
    }
    if (layer.type === 'fill-extrusion') paint['fill-extrusion-color'] = color('building');
    if (layer.type === 'line') {
      const key = source === 'waterway' ? 'water' : source === 'park' ? 'green' :
        source === 'boundary' ? 'boundary' : /casing|rail/.test(layer.id) ? 'boundary' : 'road';
      paint['line-color'] = color(key);
    }
    if (layer.type === 'symbol' && layer.layout?.['text-field']) {
      paint['text-color'] = color('label');
      paint['text-halo-color'] = color('land');
    }
  }
  return style;
}
