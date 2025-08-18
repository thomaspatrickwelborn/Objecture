import { assign, freeze } from 'recourse'
import ObjectMethods from './object/index.js'
import ArrayMethods from './array/index.js'
import MapMethods from './map/index.js'
const MethodDefinitionGroups = freeze({
  // -----
  // Array
  // -----
  array: [
    // {
    //   type: 'mutators', 
    //   methodNames: Object.keys(ArrayMethods), 
    //   /* methodNames: ['concat', 'copyWithin', 'fill', 'pop', 'push',
    //   'reverse', 'shift', 'sort', 'splice', 'unshift',] */
    //   methodDescriptor: function($methodName, $model, $options) {
    //     return { configurable: true, get() {
    //       return Object.defineProperty(
    //         $model, $methodName, ArrayMethods[$methodName].bind(null, $model, $options)
    //       )[$methodName]
    //     } }
    //   },
    // },
    // {
    //   type: 'accessors', 
    //   methodNames: [
    //     'at', 'includes', 'indexOf', 'join', 'lastIndexOf', 
    //     'slice', 'toReversed', 'toSorted', 'toSpliced', 'with', 
    //   ],
    //   methodDescriptor: function($methodName, $model) {
    //     return { configurable: true, get() {
    //       return Object.defineProperty(
    //         $model, $methodName, Array.prototype[$methodName].bind(null, $model)
    //       )[$methodName]
    //     } }
    //   },
    // },
    // {
    //   type: 'iterators', 
    //   methodNames: [
    //     'every', 'filter', 'find', 'findIndex', 'findLast',
    //     'findLastIndex', 'flat', 'flatMap', 'forEach', 'map', 
    //     'reduce', 'reduceRight', 'some', 'sort',   
    //   ], 
    //   methodDescriptor: function($methodName, $model) {
    //     return { configurable: true, get() {
    //       return Object.defineProperty(
    //         $model, $methodName, Array.prototype[$methodName].bind(null, $model)
    //       )[$methodName]
    //     } }
    //   },
    // },
    // {
    //   type: 'static', 
    //   methodNames: ['from', 'fromAsync', 'isArray', 'of'], 
    //   methodDescriptor: function($methodName, $model) {
    //     return { configurable: true, get() {
    //       return Object.defineProperty(
    //         $model, $methodName, Array[$methodName]
    //       )[$methodName]
    //     } }
    //   }, 
    // },
    // {
    //   type: 'properties', 
    //   methodNames: ['length'], 
    //   methodDescriptor: function($propertyName, $model, $options) {
    //     return {
    //       get() { return $model.receiver.length },
    //       set($propertyValue) { $model.receiver.length = $propertyValue },
    //     }
    //   },
    // },
  ],
  // ------
  // Object
  // ------
  object: [
    // {
    //   type: 'mutators',
    //   /* methodNames: [
    //     'assign', 'defineProperties', 'defineProperty', 'freeze', 'seal',
    //     'toString', 'valueOf',
    //   ], */
    //   methodNames: Object.keys(ObjectMethods), 
    //   methodDescriptor: function($methodName, $model, $options) {
    //     return { configurable: true, get() {
          
    //       return Object.defineProperty($model, $methodName, {
    //         value: ObjectMethods[$methodName].bind(null, $model, $options)
    //       })[$methodName]
    //     } }
    //   },
    // },
    // {
    //   type: 'mutators',
    //   methodNames: ['preventExtensions', 'setPrototypeOf'],
    //   methodDescriptor: function($methodName, $model) {
    //     return { configurable: true, get() {
    //       return Object.defineProperty($model, $methodName, {
    //         value: Object[$methodName].bind(null, $model.valueOf())
    //       })[$methodName]
    //     } }
    //   },
    // },
    // {
    //   type: 'creators',
    //   methodNames: ['create', 'fromEntries', 'groupBy'],
    //   methodDescriptor: function($methodName, $model, $options) {
    //     return { configurable: true, get() {
    //       return Object.defineProperty($model, $methodName, {
    //         value: Object[$methodName].bind(null, $model, $options)
    //       })[$methodName]
    //     } }
    //   },
    // },
    // {
    //   type: 'accessors', 
    //   methodNames: ['toString', 'valueOf'],
    //   methodDescriptor: function($methodName, $model, $options) {
    //     return { value: ObjectMethods[$methodName].bind(null, $model, $options) }
    //   },
    // },
    // {
    //   type: 'accessors',
    //   methodNames: [
    //     'entries', 'getOwnPropertyDescriptors', 'getOwnPropertyDescriptor', 
    //     'getOwnPropertyNames', 'getPrototypeOf', 
    //     'hasOwn', 'is', 'isExtensible', 'isFrozen', 'isSealed', 
    //     'keys', 'toLocaleString', 'values',
    //   ],
    //   methodDescriptor: function($methodName, $model) {
    //     return 
    //   },
    // },
  ],
  // ---
  // Map
  // ---
  // map: [
  //   {
  //     type: 'mutators',
  //     /* methodNames: ['delete', 'get', 'set', 'clear'], */
  //     methodNames: Object.keys(MapMethods),
  //     methodDescriptor: function($methodName, $model, $options) {
  //       return { value: MapMethods[$methodName].bind(null, $model, $options) }
  //     },
  //   }, 
  // ]
})
export default function DefineMethods($model) {
  iterateDefaultPropertyClasses: // Object, Array, Map
  for(const [$methodDefinitionGroup, $methodDefinitions] of Object.entries(MethodDefinitionGroups)) {
    iteratePropertyClasses: 
    for(const $methodDefinition of $methodDefinitions) {
      const { methodNames, methodDescriptor, type } = $methodDefinition
      for(const $methodName of methodNames) {
        const modelMethodOptions = assign(
          {}, $model.options, $model.options.methods[$methodDefinitionGroup][$methodName]
        )
        const methodOptions = assign({}, $model.options, modelMethodOptions)
        delete methodOptions.methods
        methodOptions.mutatorEvents = modelMethodOptions.mutatorEvents
        try {
          Object.defineProperty(
            $model, $methodName, methodDescriptor($methodName, $model, methodOptions)
          )
        }
        catch($err) { /* console.error($err) */ }
      }
    }
  }
  return $model
}
