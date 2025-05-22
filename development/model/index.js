import { Core, Coutil } from 'core-plex'
import LocalStorage from './local-storage/index.js'
const { typedObjectLiteral, typeOf } = Coutil
import Schema from '../schema/index.js'
import Options from './options/index.js'
import ModelEvent from './events/model/index.js'
import Methods from './methods/index.js'
import Assign from './assign/index.js'

export default class Model extends Core {
  constructor($properties = {}, $schema = null, $options = {}) {
    super({ propertyDirectory: { accessors: [($target, $property) => {
      if($property === undefined) { return $target.target }
      else { return $target.get($property) }
    }] } })
    const properties = ($properties instanceof Model) ? $properties.valueOf() : $properties
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
      'key': { get() { return (path) ? path.pop() : path } },
      'target': { configurable: true, get() {
        const target = typedObjectLiteral(properties)
        Object.defineProperty(this, 'target', { value: target })
        return target
      } },
      'type': { configurable: true, get() {
        const type = typeOf(this.target)
        Object.defineProperty(this, 'type', { value: type })
        return type
      } },
      'schema': { configurable: true, get() {
        const typeOfSchema = typeOf($schema)
        let schema
        if(['undefined', 'null'].includes(typeOfSchema)) { schema = null }
        else if($schema instanceof Schema) { schema = $schema }
        else if(['array', 'object'].includes(typeOfSchema)) { schema = new Schema($schema) }
        Object.defineProperty(this, 'schema', { value: schema })
        return schema
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
          let path
          if(typeof this.options.localStorage === 'string') {
            if(path[0] !== "/") { path = "/".concat(path) }
            else { path = this.options.localStorage }
          }
          else if(this.options.localStorage === true) {
            path = [window.location.pathname]
            if(this.path) { path.push(path) }
            path = path.join('')
          }
          if(path !== undefined) { _localStorage = new LocalStorage(path) }
          else { _localStorage = null }
          Object.defineProperty(this, 'localStorage', { value: _localStorage})
          return _localStorage
        } },
        'save': { value: function save() {
          return this.localStorage.set(this.valueOf())
        } },
        'load': { value: function load() {
          const loadValue = this.localStorage.get()
          if(loadValue) { return this.localStorage.set(loadValue) }
        } },
        'unload': { value: function unload() {
          return this.localStorage.remove()
        } },
      })
    }
    Methods(this)
    Assign(this, properties, this.options)
  }
  retroReenableEvents() {
    let model = this
    while(model) {
      model.reenableEvents({ enable: true })
      model = model.parent
    }
    return this
  }
  parse($settings = { type: 'object', replacer: null, space: 0 }) {
    let parsement = typedObjectLiteral(this.type)
    for(const [
      $propertyDescriptorName, $propertyDescriptor
    ] of Object.entries(
      Object.getOwnPropertyDescriptors(this.target))
    ) {
      let { enumerable, value, writable, configurable } = $propertyDescriptor
      if(value instanceof Model) {
        Object.defineProperty(parsement, $propertyDescriptorName, {
          enumerable, value: value.valueOf(), writable, configurable
        })
      }
      else {
        Object.defineProperty(parsement, $propertyDescriptorName, {
          enumerable, value, writable, configurable
        })
      }
    }
    let { type, replacer, space } = $settings
    if(type === 'object') { return parsement }
    else if(type === 'string') { return JSON.stringify(parsement, replacer, space) }
    else { return undefined }
  }
}