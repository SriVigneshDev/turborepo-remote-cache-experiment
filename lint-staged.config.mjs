export default {
  // All JS/TS/JSON/CSS files
  '*.{js,jsx,ts,tsx,json,css}': [
    'biome check --write  --no-errors-on-unmatched',
  ],
}
