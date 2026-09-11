/**
 * Fase 0 promised a subtle grain over flat color fields so they read as silk
 * and paper instead of a digital gradient — this is that texture. One tiny
 * inline SVG (feTurbulence, desaturated), tiled as a CSS background, so it
 * costs nothing at runtime and needs no image asset.
 */
const GRAIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;

export const GRAIN_DATA_URI = `data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}`;
