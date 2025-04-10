import { Coutil } from '/dependencies/core-plex.js'
const { recursiveAssign, recursiveFreeze } = Coutil
import ObjectProperty from './object/index.js'
import ArrayProperty from './array/index.js'
import AccessorProperty from './accessor/index.js'
const Defaults = Object.freeze({
  object: [{
    keys: ['valueOf'],
    createMethod: function($methodName, $model) {
      return function valueOf() { return $model.parse({ type: 'object' }) }
    },
  }, {
    keys: ['toString'],
    createMethod: function($methodName, $model) {
      return function toString($parseSettings = {}) {
        const replacer = ($parseSettings.replacer !== undefined)
          ? $parseSettings.replacer : null
        const space = ($parseSettings.space !== undefined)
          ? $parseSettings.space : 0
        return $model.parse({ type: 'string', replacer, space })
      }
    }, 
  }, {
    keys: [
      'entries', 'fromEntries', 'getOwnPropertyDescriptors', 
      'getOwnPropertyDescriptor', 'getOwnPropertyNames', 
      /* 'getOwnPropertySymbols', */ 'groupBy', 'hasOwn', 'is', 
      'getPrototypeOf', 'isExtensible', 'isFrozen', 'isSealed', 
      'keys', 'preventExtensions', 'values',
    ],
    createMethod: function($methodName, $model) {
      return Object[$methodName].bind(null, $model.valueOf())
    },
  }, {
    keys: ['propertyIsEnumerable', 'hasOwnProperty'], 
    createMethod: function($methodName, $model) {
      return () => $model.parse({ type: 'object' })[$methodName]
    },
  }, {
    type: 'mutators',
    keys: Object.keys(ObjectProperty), 
    createMethod: function($methodName, $model, $options) {
      return ObjectProperty[$methodName].bind(null, $model, $options) 
    }
  }],
  array: [{
    keys: [
      'from', 'fromAsync', 'isArray', 'of', 
    ], 
    createMethod: function($methodName, $model) {
      return Array[$methodName]
    }, 
  }, {
    keys: [
      'at', 'every', 'filter', 'find', 'findIndex', 'findLast',
      'findLastIndex', 'flat', 'flatMap', 'forEach', 'includes', 
      'indexOf', 'join', 'lastIndexOf', 'map', 'reduce', 'reduceRight', 
      'slice', 'some', 'sort', 'toReversed',  'toSorted', 'toSpliced', 
      'with', 
    ], 
    createMethod: function($methodName, $model) {
      return Array.prototype[$methodName].bind(null, $model)
    }
  }, {
    type: 'mutators',
    keys: Object.keys(ArrayProperty), 
    createMethod: function($methodName, $model, $options) {
      return ArrayProperty[$methodName].bind(null, $model, $options)
    }
  }],
  accessor: [{
    type: 'mutators',
    keys: Object.keys(AccessorProperty),
    createMethod: function($methodName, $model, $options) {
      return AccessorProperty[$methodName].bind(null, $model, $options)
    }
  }]
})
export default function Methods($model) {
  iterateDefaultPropertyClasses: // Object, Array, Accessor
  for(const [$propertyClassName, $propertyClasses] of Object.entries(Defaults)) {
    iteratePropertyClasses: 
    for(const $propertyClass of $propertyClasses) {
      const { keys, createMethod, type } = $propertyClass
      for(const $methodName of keys) {
        if($propertyClassName === 'accessor' || type === 'mutators') {
          const modelMethodOptions = structuredClone($model.options.methods[$propertyClassName][$methodName])
          const methodOptions = Object.assign({}, $model.options)
          delete methodOptions.mutatorEvents
          methodOptions.mutatorEvents = modelMethodOptions.mutatorEvents
          Object.defineProperty($model, $methodName, {
            enumerable: false, writable: false, configurable: false, 
            value: createMethod($methodName, $model, methodOptions),
          })
        }
        else {
          Object.defineProperty($model, $methodName, {
            enumerable: false, writable: false, configurable: false, 
            value: createMethod($methodName,  $model),
          })
        }
      }
    }
  }
  return $model
}
