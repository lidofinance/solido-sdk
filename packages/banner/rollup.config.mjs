import svgr from '@svgr/rollup';
import json from '@rollup/plugin-json';

import rootConfig from '../../rollup.config.mjs';

const config = rootConfig(['.svg', '.ts', '.tsx']);

export default {
  ...config,
  input: './src/index.tsx',
  plugins: [...config.plugins, svgr(), json()],
  external: ['react', 'react-dom', 'react/jsx-runtime', 'styled-components'],
};
