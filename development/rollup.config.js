import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
export default [{
  // Unminified
  input: './index.js',
  cache: false,
  treeshake: true,
  output: [
    {
      file: '../distributement/objecture.js',
      format: 'es',
      sourcemap: true,
    },
    {
      file: '../demonstrament/static/dependencies/objecture.js',
      format: 'es',
      sourcemap: true,
    }
  ],
  plugins: [
    nodeResolve(),
    commonjs({ transformMixedEsModules: true }),
  ]
}, {
  // Minified
  input: './index.js',
  cache: false,
  treeshake: true,
  output: [
    {
      file: '../distributement/objecture.min.js',
      format: 'es',
      sourcemap: true,
    },
    {
      file: '../demonstrament/static/dependencies/objecture.min.js',
      format: 'es',
      sourcemap: true,
    }
  ],
  plugins: [
    nodeResolve(),
    commonjs({ transformMixedEsModules: true }),
    terser(),
  ]
}, {
  // Unminified, Sans Core-Plex
  input: './index.js',
  cache: false,
  treeshake: true,
  external: ['core-plex'],
  output: [
    {
      file: '../distributement/objecture.sans.core-plex.js',
      format: 'es',
      sourcemap: true,
    }
  ],
  plugins: [
    nodeResolve(),
    commonjs({ transformMixedEsModules: true }),
  ]
}]