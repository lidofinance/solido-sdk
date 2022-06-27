import typescript from 'rollup-plugin-typescript2';
import del from 'rollup-plugin-delete';
import svgr from '@svgr/rollup'
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import url from '@rollup/plugin-url';

import { nodeResolve } from '@rollup/plugin-node-resolve';

const extensions = ['.svg', '.js', '.jsx', '.ts', '.tsx']

export default {
  input: 'src/index.ts',
  output: [
    {
      dir: 'dist/esm',
      format: 'esm',
      exports: 'named',
    },
    {
      dir: 'dist/cjs',
      format: 'cjs',
      exports: 'named',
    }
  ],

  plugins: [
    del({ targets: 'dist/*', runOnce: true }),
    alias({
      entries: [
        { find: '@/', replacement: './src/' },
      ]
    }),
    nodeResolve({ extensions }),
    commonjs({
      include: /node_modules/,
    }),
    typescript({
      tsconfig: 'tsconfig.json',
    }),
    url({
      fileName: '[dirname][hash][extname]',
    }),
    svgr(),
  ],

  external: ['react', 'react-dom', 'react/jsx-runtime', 'styled-components']
};
