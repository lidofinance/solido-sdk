import svgr from '@svgr/rollup';
import json from '@rollup/plugin-json';

import rootConfig from '../../rollup.config.mjs';

const _rootConfig = rootConfig(['.svg', '.ts', '.tsx'])

export default {
  ..._rootConfig,
  input: './src/index.tsx',
  plugins: [..._rootConfig.plugins, svgr(), json()],

  external: ['react', 'react-dom', 'react/jsx-runtime', 'styled-components'],
};
