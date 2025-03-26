import ObjectProperty from './object/index.js'
import ArrayProperty from './array/index.js'
import AccessorProperty from './accessor/index.js'
const Defaults = Object.freeze({
  object: [{
    keys: ['valueOf'],
    createMethod: function($methodName, $content) {
      return function valueOf() { return $content.parse({ type: 'object' }) }
    },
  }, {
    keys: ['toString'],
    createMethod: function($methodName, $content) {
      return function toString($parseSettings = {}) {
        const replacer = ($parseSettings.replacer !== undefined)
          ? $parseSettings.replacer : null
        const space = ($parseSettings.space !== undefined)
          ? $parseSettings.space : 0
        return $content.parse({ type: 'string', replacer, space })
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
    createMethod: function($methodName, $content) {
      return Object[$methodName].bind(null, $content.valueOf())
    },
  }, {
    keys: ['propertyIsEnumerable', 'hasOwnProperty'], 
    createMethod: function($methodName, $content) {
      return () => $content.parse({ type: 'object' })[$methodName]
    },
  }, {
    type: 'mutators',
    keys: Object.keys(ObjectProperty), 
    createMethod: function($methodName, $content, $options) {
      return ObjectProperty[$methodName].bind(null, $content, $options) 
    }
  }],
  array: [{
    keys: [
      'from', 'fromAsync', 'isArray', 'of', 
    ], 
    createMethod: function($methodName, $content) {
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
    createMethod: function($methodName, $content) {
      return Array.prototype[$methodName].bind(null, $content)
    }
  }, {
    type: 'mutators',
    keys: Object.keys(ArrayProperty), 
    createMethod: function($methodName, $content, $options) {
      return ArrayProperty[$methodName].bind(null, $content, $options)
    }
  }],
  accessor: [{
    type: 'mutators',
    keys: Object.keys(AccessorProperty),
    createMethod: function($methodName, $content, $options) {
      return AccessorProperty[$methodName].bind(null, $content, $options)
    }
  }]
})
export default function Methods($content) {
  iterateDefaultPropertyClasses: // Object, Array, Accessor
  for(const [$propertyClassName, $propertyClasses] of Object.entries(Defaults)) {
    iteratePropertyClasses: 
    for(const $propertyClass of $propertyClasses) {
      const { keys, createMethod, type } = $propertyClass
      for(const $methodName of keys) {
        if($propertyClassName === 'accessor' || type === 'mutators') {
          const methodOptions = $content.options?.methods[$propertyClassName][$methodName] || {}
          Object.defineProperty($content, $methodName, {
            enumerable: false, writable: false, configurable: false, 
            value: createMethod($methodName, $content, methodOptions),
          })
        }
        else {
          Object.defineProperty($content, $methodName, {
            enumerable: false, writable: false, configurable: false, 
            value: createMethod($methodName,  $content),
          })
        }
      }
    }
  }
  return $content
}
