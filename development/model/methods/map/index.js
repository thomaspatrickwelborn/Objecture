import getProperty from './get-property/index.js'
import setProperty from './set-property/index.js'
import deleteProperty from './delete-property/index.js'
// import clear from './clear/index.js'
export default {
  get: getProperty,
  set: setProperty,
  delete: deleteProperty,
  // clear: clearProperty,
}