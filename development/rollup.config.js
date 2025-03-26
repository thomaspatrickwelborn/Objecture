import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
export default [{
  input: './index.js',
  cache: false,
  // treeshake: {
  //   correctVarValueBeforeDeclaration: true,
  // },
  treeshake: false,
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
  input: './index.js',
  cache: false,
  // treeshake: {
  //   // correctVarValueBeforeDeclaration: true,
  // },
  treeshake: false,
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
}]