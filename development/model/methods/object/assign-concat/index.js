import assignSources from '../assign-sources/index.js'
export default ($target, ...$sources) => assignSources($target, 'assignConcat', ...$sources)