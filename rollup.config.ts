export default {
  input: 'src/index.ts',
  output: [
    {
      name: 'solidoSdk',
      dir: 'dist/umd',
      format: 'umd',
    },
    {
      dir: 'dist/esm',
      format: 'esm',
    },
    {
      name: 'solidoSdk',
      dir: 'dist/iife',
      format: 'iife',
    },
    {
      name: 'solidoSdk',
      dir: 'dist/cjs',
      format: 'cjs',
    }
  ],
};
