import typescript from 'rollup-plugin-typescript2';
import del from 'rollup-plugin-delete';
import commonjs from '@rollup/plugin-commonjs';
import url from '@rollup/plugin-url';
import ttypescript from 'ttypescript';

import { nodeResolve } from '@rollup/plugin-node-resolve';

export default (extensions) => ({
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
    },
  ],

  plugins: [
    del({ targets: 'dist/*', runOnce: true }),
    nodeResolve({ extensions, preferBuiltins: false }),
    commonjs({
      include: /node_modules/,
    }),
    typescript({
      typescript: ttypescript,
      tsconfig: 'tsconfig.json',
      exclude: '**/tests/**',
    }),
    url({
      fileName: '[dirname][hash][extname]',
      limit: 30720,
    }),
  ],
});
