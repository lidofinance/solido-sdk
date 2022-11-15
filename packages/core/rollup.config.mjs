import rootConfig from '../../rollup.config.mjs';

export default {
  ...rootConfig(['.ts', '.tsx']),
  input: './src/index.ts',

  external: ['@solana/web3.js', '@solana/buffer-layout', '@solana/spl-token', 'bn.js'],
};
