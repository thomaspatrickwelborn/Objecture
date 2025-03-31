export default {
  active: true,
  name: 'Objecture | Content | Unshift',
  path: '/content/unshift',
  source: 'documents/content/unshift',
  target: 'localhost/content/unshift',
  ignore: [],
  main: 'index.html',
  pilers: {
    sans: [{
      name: 'ClearPiler',
      type: 'sans',
      target: 'source',
      path: ['**/template.js'],
      ignore: ['**/$template.js'],
    }, {
      name: 'ClearPiler',
      type: 'sans',
      target: 'target',
      path: ['*.{html,css,js,md,map,ico}'],
      ignore: [],
    }],
    simules: [{
      name: 'SimulePiler',
      type: 'simules',
      outputType: 'path',
      input: 'favicon.ico',
      output: 'favicon.ico',
      watch: ['favicon.ico'],
      ignore: [],
    }],
    styles: [{
      name: 'SASSPiler',
      type: 'styles',
      input: 'index.scss',
      output: 'index.css',
      watch: ['**/*.scss'],
      ignore: [],
      inputOptions: {},
      outputOptions: {
        sourceMap: true,
      },
    }],
    scripts: [{
      name: 'RollupPiler',
      type: 'scripts',
      watch: ['**/*.js'],
      ignore: [
        '**/$route.js',
        '**/$document.js',
        '**/$socket.js',
      ],
      input: 'index.js',
      output: 'index.js',
      inputOptions: {
        logLevel: 'silent', 
        external: [
          '/dependencies/objecture.js',
          '/coutil/index.js',
        ],
      },
      outputOptions: {
        format: 'es',
        sourcemap: true,
      },
    }],
    structs: [{
      name: 'EJSPiler',
      type: 'structs',
      outputType: 'server',
      model: 'index.json',
      watch: ['**/*.{ejs,json}'],
      ignore: ['**/$*.ejs'],
      input: 'index.ejs',
      output: 'index.html',
      outputOptions: {
        localsName: '$content',
        root: ['templates'],
      },
    }, {
      name: 'EJSPiler',
      type: 'structs',
      outputType: 'client',
      watch: ['**/$*.ejs'],
      ignore: [],
      input: '**/*.ejs',
      output: '',
      outputOptions: {
        localsName: '$content',
        root: [''],
      }, 
    }],
  }
}