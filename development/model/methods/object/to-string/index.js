import valueOf from '../value-of/index.js'
import { Getters } from '../tensors/index.js'
import { ObjectKeys } from '../variables/index.js'
const Options = { space: 0, replacer: null, returnValue: 'target', nonenumerable: true }
export default function toString($source, $options) {
  const options = Object.assign({}, Options, $options)
  return JSON.stringify(
    valueOf($source, options), options.replacer, options.space
  )
}