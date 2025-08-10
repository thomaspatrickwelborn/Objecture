import { assign, freeze } from 'recourse'
import ObjectProperty from './object/index.js'
import ArrayProperty from './array/index.js'
import MapProperty from './map/index.js'
const MethodDefinitionGroups = freeze({
  object: [{
    methodNames: ['valueOf'],
    methodDescriptor: function($methodName, $model) {
      return { value: function valueOf() { return $model.parse({ type: 'object' }) } }
    },
  }, {
    methodNames: ['toString'],
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
    methodNames: [
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
    // type: 'accessors',
    type: 'introspectors',
    methodNames: ['propertyIsEnumerable', 'hasOwnProperty'], 
    methodDescriptor: function($methodName, $model) {
      return { value: () => $model.parse({ type: 'object' })[$methodName] }
    },
  }, {
    type: 'mutators',
    methodNames: Object.keys(ObjectProperty), 
    methodDescriptor: function($methodName, $model, $options) {
      return { value: ObjectProperty[$methodName].bind(null, $model, $options) }
    }
  }],
  array: [{
    methodNames: ['length'], 
    methodDescriptor: function($propertyName, $model, $options) {
      return {
        get() { return $model.receiver.length },
        set($propertyValue) { $model.receiver.length = $propertyValue },
      }
    }
  }, {
    methodNames: ['from', 'fromAsync', 'isArray', 'of'], 
    methodDescriptor: function($methodName, $model) {
      return { value: Array[$methodName] }
    }, 
  }, {
    methodNames: [
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
    methodNames: Object.keys(ArrayProperty), 
    methodDescriptor: function($methodName, $model, $options) {
      return { value: ArrayProperty[$methodName].bind(null, $model, $options) }
    }
  }],
  // 
  map: [{
    type: 'mutators',
    methodNames: Object.keys(MapProperty),
    methodDescriptor: function($methodName, $model, $options) {
      return { value: MapProperty[$methodName].bind(null, $model, $options) }
    }
  }/*, {
    type: 'stat',
    methodNames: ['has'],
    methodDescriptor: function($methodName, $model, $options) {
      return { value: MapProperty[$methodName].bind(null, $model, $options) }
    }
  }*/]
})
export default function Methods($model) {
  iterateDefaultPropertyClasses: // Object, Array, Map
  for(const [$methodDefinitionGroup, $methodDefinitions] of Object.entries(MethodDefinitionGroups)) {
    iteratePropertyClasses: 
    for(const $methodDefinition of $methodDefinitions) {
      const { methodNames, methodDescriptor, type } = $methodDefinition
      for(const $methodName of methodNames) {
        if($methodDefinitionGroup === 'map' || type === 'mutators') {
          const modelMethodOptions = structuredClone(
            $model.options.methods[$methodDefinitionGroup][$methodName]
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
