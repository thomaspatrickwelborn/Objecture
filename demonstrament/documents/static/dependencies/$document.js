export default {
  active: true,
  name: 'Objecture | Model',
  source: 'documents/static/dependencies',
  target: 'static/dependencies',
  ignore: [],
  pilers: {
    sans: [],
    simules: [{
      name: 'SimulePiler',
      type: 'simules',
      outputType: 'path',
      input: '../../../node_modules/core-plex/distributement/core-plex.js',
      output: '../../static/dependencies/core-plex.js',
      watch: ['../../../node_modules/core-plex/distributement/*.{js,map}'],
      ignore: [],
    }, {
      name: 'SimulePiler',
      type: 'simules',
      outputType: 'path',
      input: '../../../node_modules/recourse/distributement/recourse.js',
      output: '../../static/dependencies/recourse.js',
      watch: ['../../../node_modules/recourse/distributement/*.{js,map}'],
      ignore: [],
    }],
    styles: [],
    scripts: [],
    structs: [],
  }
}