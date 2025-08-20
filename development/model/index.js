import Core from 'core-plex'
import { Recourse, typedObjectLiteral, typeOf } from 'recourse'
import { Route as LocalStorage } from 'atilax'
import Schema from '../schema/index.js'
import Options from './options/index.js'
import ModelEvent from './events/model/index.js'
import Assign from './assign/index.js'
import ObjectMethods from './methods/object/index.js'
import ArrayMethods from './methods/array/index.js'
import MapMethods from './methods/map/index.js'

function modelOptions($model, $methodDefinitionGroup, $methodName) {
  const methodOptions = Object.assign(
    {}, $model.options, $model.options.methods[$methodDefinitionGroup][$methodName]
  )
  delete methodOptions.methods
  return methodOptions
}
export default class Model extends Core {
  constructor($properties = {}, $schema = null, $options = {}) {
    super()
    if($properties instanceof Model) { $properties = $properties.valueOf() }
    let parent = null
    let path = null
    try {
      Object.defineProperty(this, 'mount', { value: function($mount) {
        const mountParent = $mount.parent
        const mountPath = $mount.path
        const property = (mountPath) ? mountPath.split('.').pop() : mountPath
        if(parent) { parent.unmount(property) }
        parent = mountParent
        path = mountPath
      } })
    }
    catch($err) { console.error($err) }
    try {
      Object.defineProperty(this, 'unmount', { value: function($unmount) {
        const unmountPath = $unmount.path
        delete this[$property]
      } })
    }
    catch($err) { console.error($err) }
    Object.defineProperties(this, {
      'key': { get() { return (path) ? path.pop() : path } },
      'options': { configurable: true, get() {
        const options = Options($options)
        if(options.events) {
          this.addEvents(options.events)
          delete options.events
        }
        if(options.enableEvents) {
          const typeofEnableEvents = typeof options.enableEvents
          if(typeofEnableEvents === 'boolean') { this.enableEvents() }
          else if(typeofEnableEvents === 'object') { this.enableEvents(options.enableEvents) }
        }
        Object.defineProperty(this, 'options', { value: options })
        return options
      } },
      'parent': { get() { return parent } },
      'path': { get() { return path } },
      'receiver': { value: typedObjectLiteral($properties) },
      'schema': { configurable: true, get() {
        const typeOfSchema = typeOf($schema)
        let schema
        if(['undefined', 'null'].includes(typeOfSchema)) { schema = null }
        else if($schema instanceof Schema) { schema = $schema }
        else if(['array', 'object'].includes(typeOfSchema)) { schema = new Schema($schema) }
        Object.defineProperty(this, 'schema', { value: schema })
        return schema
      } },
      'target': { value: $properties },
      'type': { configurable: true, get() {
        const type = typeOf(this.receiver)
        Object.defineProperty(this, 'type', { value: type })
        return type
      } },
    })
    this.mount({
      parent: this.options.parent,
      path: this.options.path
    })
    if(localStorage && this.options.localStorage) {
      Object.defineProperties(this,  {
        'localStorage': { configurable: true, get() {
          let _localStorage
          let path = [window.location.pathname]
          if(this.path) { path.push(this.path) }
          path = path.join('')
          _localStorage = new LocalStorage(path, this.options.localStorage)
          Object.defineProperty(this, 'localStorage', { value: _localStorage })
          return _localStorage
        } },
        'save': { value: function save() {
          return this.localStorage.set(this.valueOf())
        } },
        'load': { value: function load() {
          return this.localStorage.get()
        } },
        'unload': { value: function unload() {
          return this.localStorage.remove()
        } },
      })
    }
    if(this.options.autoload) {
      Assign(this, this.load() || $properties, this.options)
    }
    else {
      Assign(this, $properties, this.options)
    }
  }
  retroReenableEvents() {
    let model = this
    while(model) {
      model.reenableEvents({ enable: true })
      model = model.parent
    }
    return this
  }
  // ARRAY | mUTATORS
  get concat() { return Object.defineProperty(
    this, 'concat', ArrayMethods['concat'].bind(null, this, modelOptions(this, 'array', 'concat'))
  )['concat'] }
  get copyWithin() { return Object.defineProperty(
    this, 'copyWithin', ArrayMethods['copyWithin'].bind(null, this, modelOptions(this, 'array', 'copyWithin'))
  )['copyWithin'] }
  get fill() { return Object.defineProperty(
    this, 'fill', ArrayMethods['fill'].bind(null, this, modelOptions(this, 'array', 'fill'))
  )['fill'] }
  get pop() { return Object.defineProperty(
    this, 'pop', ArrayMethods['pop'].bind(null, this, modelOptions(this, 'array', 'pop'))
  )['pop'] }
  get push() { return Object.defineProperty(
    this, 'push', ArrayMethods['push'].bind(null, this, modelOptions(this, 'array', 'push'))
  )['push'] }
  get reverse() { return Object.defineProperty(
    this, 'reverse', ArrayMethods['reverse'].bind(null, this, modelOptions(this, 'array', 'reverse'))
  )['reverse'] }
  get shift() { return Object.defineProperty(
    this, 'shift', ArrayMethods['shift'].bind(null, this, modelOptions(this, 'array', 'shift'))
  )['shift'] }
  get sort() { return Object.defineProperty(
    this, 'sort', ArrayMethods['sort'].bind(null, this, modelOptions(this, 'array', 'sort'))
  )['sort'] }
  get splice() { return Object.defineProperty(
    this, 'splice', ArrayMethods['splice'].bind(null, this, modelOptions(this, 'array', 'splice'))
  )['splice'] }
  get unshift() { return Object.defineProperty(
    this, 'unshift', ArrayMethods['unshift'].bind(null, this, modelOptions(this, 'array', 'unshift'))
  )['unshift'] }
    // ARRAY | ACCESSORS
  get at() { return Object.defineProperty(
    this, 'at', Array.prototype['at'].bind(null, this)
  )['at'] }
  get includes() { return Object.defineProperty(
    this, 'includes', Array.prototype['includes'].bind(null, this)
  )['includes'] }
  get indexOf() { return Object.defineProperty(
    this, 'indexOf', Array.prototype['indexOf'].bind(null, this)
  )['indexOf'] }
  get join() { return Object.defineProperty(
    this, 'join', Array.prototype['join'].bind(null, this)
  )['join'] }
  get lastIndexOf() { return Object.defineProperty(
    this, 'lastIndexOf', Array.prototype['lastIndexOf'].bind(null, this)
  )['lastIndexOf'] }
  get slice() { return Object.defineProperty(
    this, 'slice', Array.prototype['slice'].bind(null, this)
  )['slice'] }
  get toReversed() { return Object.defineProperty(
    this, 'toReversed', Array.prototype['toReversed'].bind(null, this)
  )['toReversed'] }
  get toSorted() { return Object.defineProperty(
    this, 'toSorted', Array.prototype['toSorted'].bind(null, this)
  )['toSorted'] }
  get toSpliced() { return Object.defineProperty(
    this, 'toSpliced', Array.prototype['toSpliced'].bind(null, this)
  )['toSpliced'] }
  get with() { return Object.defineProperty(
    this, 'with', Array.prototype['with'].bind(null, this)
  )['with'] }
  //   ARRAY | ITERATORS
  get every() { return Object.defineProperty(
    this, 'every', Array.prototype['every'].bind(null, this)
  )['every'] }
  get filter() { return Object.defineProperty(
    this, 'filter', Array.prototype['filter'].bind(null, this)
  )['filter'] }
  get find() { return Object.defineProperty(
    this, 'find', Array.prototype['find'].bind(null, this)
  )['find'] }
  get findIndex() { return Object.defineProperty(
    this, 'findIndex'.prototype[$methodName].bind('findIndex', this)
  )['findIndex'] }
  get findLast() { return Object.defineProperty(
    this, 'findLast'.prototype[$methodName].bind('findLast', this)
  )['findLast'] }
  get findLastIndex() { return Object.defineProperty(
    this, 'findLastIndex'.prototype[$methodName].bind('findLastIndex', this)
  )['findLastIndex'] }
  get flat() { return Object.defineProperty(
    this, 'flat', Array.prototype['flat'].bind(null, this)
  )['flat'] }
  get flatMap() { return Object.defineProperty(
    this, 'flatMap'.prototype[$methodName].bind('flatMap', this)
  )['flatMap'] }
  get forEach() { return Object.defineProperty(
    this, 'forEach'.prototype[$methodName].bind('forEach', this)
  )['forEach'] }
  get map() { return Object.defineProperty(
    this, 'map', Array.prototype['map'].bind(null, this)
  )['map'] }
  get reduce() { return Object.defineProperty(
    this, 'reduce', Array.prototype['reduce'].bind(null, this)
  )['reduce'] }
  get reduceRight() { return Object.defineProperty(
    this, 'reduceRight'.prototype[$methodName].bind('reduceRight', this)
  )['reduceRight'] }
  get some() { return Object.defineProperty(
    this, 'some', Array.prototype['some'].bind(null, this)
  )['some'] }
  get sort() { return Object.defineProperty(
    this, 'sort', Array.prototype['sort'].bind(null, this)
  )['sort'] }
  // ARRAY | STATIC
  get from() { return Object.defineProperty(
    this, 'from', Array['from']
  )['from'] }
  get fromAsync() { return Object.defineProperty(
    this, 'fromAsync', Array['fromAsync']
  )['fromAsync'] }
  get isArray() { return Object.defineProperty(
    this, 'isArray', Array['isArray']
  )['isArray'] }
  get of() { return Object.defineProperty(
    this, 'of', Array['of']
  )['of'] }
  get length() { return this.receiver.length }
  set length($length) { this.receiver.length = $length }
  // OBJECT | mUTATORS
  get assign() { return Object.defineProperty(this, 'assign', {
    value: ObjectMethods['assign'].bind(null, this, modelOptions(this, 'object', 'assign'))
  })['assign'] }
  get defineProperties() { return Object.defineProperty(this, 'defineProperties', {
    value: ObjectMethods['defineProperties'].bind(null, this, modelOptions(this, 'object', 'defineProperties'))
  })['defineProperties'] }
  get defineProperty() { return Object.defineProperty(this, 'defineProperty', {
    value: ObjectMethods['defineProperty'].bind(null, this, modelOptions(this, 'object', 'defineProperty'))
  })['defineProperty'] }
  get freeze() { return Object.defineProperty(this, 'freeze', {
    value: ObjectMethods['freeze'].bind(null, this, modelOptions(this, 'object', 'freeze'))
  })['freeze'] }
  get seal() { return Object.defineProperty(this, 'seal', {
    value: ObjectMethods['seal'].bind(null, this, modelOptions(this, 'object', 'seal'))
  })['seal'] }

  get toString() { return Object.defineProperty(this, 'toString', {
    value: Recourse['toString'].bind(null, this.target, modelOptions(this, 'object', 'toString'))
  })['toString'] }

  get valueOf() { return Object.defineProperty(this, 'valueOf', {
    value: Recourse['valueOf'].bind(null, this.target, modelOptions(this, 'object', 'valueOf'))
  })['valueOf'] }

  // OBJECT | MUTATORS
  get preventExtensions() { return Object.defineProperty(this, 'preventExtensions', {
    value: Object['preventExtensions'].bind(null, this.valueOf())
  })['preventExtensions'] }
  get setPrototypeOf() { return Object.defineProperty(this, 'setPrototypeOf', {
    value: Object['setPrototypeOf'].bind(null, this.valueOf())
  })['setPrototypeOf'] }
  // OBJECT | ACCESSORS
  get hasOwn() { return Object.defineProperty(this, 'hasOwn', {
    value: ObjectMethods['hasOwn'].bind(null, this, modelOptions(this, 'object', 'hasOwn'))
  })['hasOwn'] }
  // OBJECT | CREATORS
  get create() { return Object.defineProperty(this, 'create', {
    value: Object['create'].bind(null, this, modelOptions(this, 'object', 'create'))
  })['create'] }
  get fromEntries() { return Object.defineProperty(this, 'fromEntries', {
    value: Object['fromEntries'].bind(null, this, modelOptions(this, 'object', 'fromEntries'))
  })['fromEntries'] }
  get groupBy() { return Object.defineProperty(this, 'groupBy', {
    value: Object['groupBy'].bind(null, this, modelOptions(this, 'object', 'groupBy'))
  })['groupBy'] }
  // OBJECT | ACCESSORS
  get entries() { return Object.defineProperty(this, 'entries', {
    value: Object['entries'].bind(null, this.valueOf()) } 
  )['entries'] }
  get getOwnPropertyDescriptors() { return Object.defineProperty(this, 'getOwnPropertyDescriptors', {
    value: Object['getOwnPropertyDescriptors'].bind(null, this.valueOf()) } 
  )['getOwnPropertyDescriptors'] }
  get getOwnPropertyDescriptor() { return Object.defineProperty(this, 'getOwnPropertyDescriptor', {
    value: Object['getOwnPropertyDescriptor'].bind(null, this.valueOf()) } 
  )['getOwnPropertyDescriptor'] }
  get getOwnPropertyNames() { return Object.defineProperty(this, 'getOwnPropertyNames', {
    value: Object['getOwnPropertyNames'].bind(null, this.valueOf()) } 
  )['getOwnPropertyNames'] }
  get getPrototypeOf() { return Object.defineProperty(this, 'getPrototypeOf', {
    value: Object['getPrototypeOf'].bind(null, this.valueOf()) } 
  )['getPrototypeOf'] }
  get is() { return Object.defineProperty(this, 'is', {
    value: Object['is'].bind(null, this.valueOf()) } 
  )['is'] }
  get isExtensible() { return Object.defineProperty(this, 'isExtensible', {
    value: Object['isExtensible'].bind(null, this.valueOf()) } 
  )['isExtensible'] }
  get isFrozen() { return Object.defineProperty(this, 'isFrozen', {
    value: Object['isFrozen'].bind(null, this.valueOf()) } 
  )['isFrozen'] }
  get isSealed() { return Object.defineProperty(this, 'isSealed', {
    value: Object['isSealed'].bind(null, this.valueOf()) } 
  )['isSealed'] }
  get keys() { return Object.defineProperty(this, 'keys', {
    value: Object['keys'].bind(null, this.valueOf()) } 
  )['keys'] }
  get toLocaleString() { return Object.defineProperty(this, 'toLocaleString', {
    value: Object['toLocaleString'].bind(null, this.valueOf()) } 
  )['toLocaleString'] }
  get values() { return Object.defineProperty(this, 'values', {
    value: Object['values'].bind(null, this.valueOf()) } 
  )['values'] }
  // MAP
  get delete() { return Object.defineProperty(this, 'delete', {
    value: MapMethods['delete'].bind(null, this, modelOptions(this, 'map', 'delete'))
  })['delete'] }
  get get() { return Object.defineProperty(this, 'get', {
    value: MapMethods['get'].bind(null, this, modelOptions(this, 'map', 'get'))
  })['get'] }
  get has() { return Object.defineProperty(this, 'has', {
    value: MapMethods['has'].bind(null, this, modelOptions(this, 'map', 'has'))
  })['has'] }
  get set() { return Object.defineProperty(this, 'set', {
    value: MapMethods['set'].bind(null, this, modelOptions(this, 'map', 'set'))
  })['set'] }
  get clear() { return Object.defineProperty(this, 'clear', {
    value: MapMethods['clear'].bind(null, this, modelOptions(this, 'map', 'clear'))
  })['clear'] }
}