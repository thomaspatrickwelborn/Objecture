import typeOf from '../type-of/index.js'
import getOwnPropertyDescriptors from '../get-own-property-descriptors/index.js'
import { TypeValidators, Tensors, Getters } from '../tensors/index.js'
import { ObjectKeys } from '../variables/index.js'
const Options = {
  getters: [Getters.Object, Getters.Map],
  typeValidators: [TypeValidators.Object, TypeValidators.Map],
  delimiter: '.',
  depth: 0,
  enumerable: true,
  frozen: false,
  maxDepth: 10,
  nonenumerable: false,
  path: false,
  pathMatch: false,
  recurse: true,
  returnValue: 'receiver',
  sealed: false,
  type: false,
}
export default function getOwnPropertyDescriptor($source, $propertyKey, $options = {}) {
  const options = Object.assign({}, Options, $options, {
    ancestors: Object.assign([], $options.ancestors),
  })
  if(options.depth >= options.maxDepth) { return }
  else { options.depth++ }
  if(!options.ancestors.includes($source)) { options.ancestors.unshift($source) }
  const getters = new Tensors(options.getters, options.typeValidators)
  const propertyValue = getters.cess($source, $propertyKey)
  if(propertyValue !== undefined) {
    if(ObjectKeys.includes(typeOf(propertyValue))) {
      if(options.ancestors.includes(propertyValue)) { return }
      else { options.ancestors.unshift(propertyValue) }
    }
    const typeOfSource = typeOf($source)
    const propertyDescriptor = (typeOfSource !== 'map')
      ? Object.getOwnPropertyDescriptor($source, $propertyKey)
      : (typeOfSource === 'map')
      ? { configurable: false, enumerable: true, value: propertyValue[1], writable: true }
      : undefined
    if(!propertyDescriptor) return undefined
    if(!options.nonenumerable && !propertyDescriptor.enumerable) { return }
    if(options.path) {
      options.path = (
        typeOf(options.path) === 'string'
      ) ? [options.path, $propertyKey].join(options.delimiter) : $propertyKey
      propertyDescriptor.path = options.path
    }
    if(options.type) { propertyDescriptor.type = typeOf(propertyValue) }
    if(options.frozen) { propertyDescriptor.frozen = Object.isFrozen(propertyValue) }
    if(options.sealed) { propertyDescriptor.sealed = Object.isSealed(propertyValue) }
    if(options.recurse && ObjectKeys.includes(typeOf(propertyValue))) {
      propertyDescriptor.value = getOwnPropertyDescriptors(propertyValue, options)
    }
    else {
      propertyDescriptor.value = propertyValue
    }
    return propertyDescriptor
  }
}