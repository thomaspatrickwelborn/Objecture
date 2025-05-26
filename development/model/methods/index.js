import { recursiveAssign, recursiveFreeze } from 'recourse'
import ObjectProperty from './object/index.js'
import ArrayProperty from './array/index.js'
import MapProperty from './map/index.js'
const Defaults = Object.freeze({
  object: [{
    keys: ['valueOf'],
    methodDescriptor: function($methodName, $model) {
      return { value: function valueOf() { return $model.parse({ type: 'object' }) } }
    },
  }, {
    keys: ['toString'],
    methodDescriptor: function($methodName, $model) {
      return { value: function toString($parseSettings = {}) {
        const replacer = ($parseSettings.replacer !== undefined)
          ? $parseSettings.replacer : null
        const space = ($parseSettings.space !== undefined)
          ? $parseSettings.space : 0
        return $model.parse({ type: 'string', replacer, space })
      } }
    }, 
  }, {
    keys: [
      'entries', 'fromEntries', 'getOwnPropertyDescriptors', 
      'getOwnPropertyDescriptor', 'getOwnPropertyNames', 
      /* 'getOwnPropertySymbols', */ 'groupBy', 'hasOwn', 'is', 
      'getPrototypeOf', 'isExtensible', 'isFrozen', 'isSealed', 
      'keys', 'preventExtensions', 'values',
    ],
    methodDescriptor: function($methodName, $model) {
      return { value: Object[$methodName].bind(null, $model.valueOf()) }
    },
  }, {
    keys: ['propertyIsEnumerable', 'hasOwnProperty'], 
    methodDescriptor: function($methodName, $model) {
      return { value: () => $model.parse({ type: 'object' })[$methodName] }
    },
  }, {
    type: 'mutators',
    keys: Object.keys(ObjectProperty), 
    methodDescriptor: function($methodName, $model, $options) {
      return { value: ObjectProperty[$methodName].bind(null, $model, $options) }
    }
  }],
  array: [{
    keys: ['length'], 
    methodDescriptor: function($propertyName, $model, $options) {
      return {
        get() { return $model.target.length },
        set($propertyValue) { $model.target.length = $propertyValue },
      }
    }
  }, {
    keys: [
      'from', 'fromAsync', 'isArray', 'of', 
    ], 
    methodDescriptor: function($methodName, $model) {
      return { value: Array[$methodName] }
    }, 
  }, {
    keys: [
      'at', 'every', 'filter', 'find', 'findIndex', 'findLast',
      'findLastIndex', 'flat', 'flatMap', 'forEach', 'includes', 
      'indexOf', 'join', 'lastIndexOf', 'map', 'reduce', 'reduceRight', 
      'slice', 'some', 'sort', 'toReversed',  'toSorted', 'toSpliced', 
      'with', 
    ], 
    methodDescriptor: function($methodName, $model) {
      return { value: Array.prototype[$methodName].bind(null, $model) }
    }
  }, {
    type: 'mutators',
    keys: Object.keys(ArrayProperty), 
    methodDescriptor: function($methodName, $model, $options) {
      return { value: ArrayProperty[$methodName].bind(null, $model, $options) }
    }
  }],
  map: [{
    type: 'mutators',
    keys: Object.keys(MapProperty),
    methodDescriptor: function($methodName, $model, $options) {
      return { value: MapProperty[$methodName].bind(null, $model, $options) }
    }
  }]
})
export default function Methods($model) {
  iterateDefaultPropertyClasses: // Object, Array, Map
  for(const [$propertyClassName, $propertyClasses] of Object.entries(Defaults)) {
    iteratePropertyClasses: 
    for(const $propertyClass of $propertyClasses) {
      const { keys, methodDescriptor, type } = $propertyClass
      for(const $methodName of keys) {
        if($propertyClassName === 'map' || type === 'mutators') {
          const modelMethodOptions = structuredClone(
            $model.options.methods[$propertyClassName][$methodName]
          )
          const methodOptions = Object.assign({}, $model.options, modelMethodOptions)
          delete methodOptions.mutatorEvents
          methodOptions.mutatorEvents = modelMethodOptions.mutatorEvents
          Object.defineProperty(
            $model, $methodName, methodDescriptor($methodName, $model, methodOptions)
          )
        }
        else {
          Object.defineProperty(
            $model, $methodName, methodDescriptor($methodName,  $model)
          )
        }
      }
    }
  }
  return $model
}
