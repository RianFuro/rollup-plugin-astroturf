export default {
  input: 'src/index.js',
  external: ['@rollup/pluginutils', '@babel/core', 'astroturf/plugin'],
  output: [
    {
      format: 'cjs',
      file: 'dist/rollup-plugin-astroturf.cjs',
      exports: 'default'
    },
    {
      format: 'es',
      file: 'dist/rollup-plugin-astroturf.mjs',
      exports: 'default'
    }
  ]
};