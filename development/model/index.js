import { Core, Coutil } from 'core-plex'
const { typedObjectLiteral, typeOf } = Coutil
import Schema from '../schema/index.js'
import Options from './options/index.js'
import ModelEvent from './events/model/index.js'
import Methods from './methods/index.js'
import Assign from './assign/index.js'

export default class Model extends Core {
  static accessors = Object.freeze([($target, $property) => {
    if($property === undefined) { return $target.target }
    else { return $target.get($property) }
  }, ($target, $property) => {
    if($property === undefined) { return $target }
    else { return $target[$property] }
  }])
  constructor($properties = {}, $schema = null, $options = {}) {
    super({ accessors: Model.accessors })
    const properties = ($properties instanceof Model) ? $properties.valueOf() : $properties
    Object.defineProperty(this, 'options', { configurable: true, get() {
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
    } })
    Object.defineProperty(this, 'target', { configurable: true, get() {
      const target = typedObjectLiteral(properties)
      Object.defineProperty(this, 'target', { value: target })
      return target
    } })
    Object.defineProperty(this, 'type', { configurable: true, get() {
      const type = typeOf(this.target)
      Object.defineProperty(this, 'type', { value: type })
      return type
    } })
    Object.defineProperty(this, 'schema', { configurable: true, get() {
      const typeOfSchema = typeOf($schema)
      let schema
      if(['undefined', 'null'].includes(typeOfSchema)) { schema = null }
      else if($schema instanceof Schema) { schema = $schema }
      else if(['array', 'object'].includes(typeOfSchema)) { schema = new Schema($schema) }
      Object.defineProperty(this, 'schema', { value: schema })
      return schema
    } })
    Object.defineProperty(this, 'parent', { configurable: true, get() {
      const options = this.options
      const parent = (options.parent) ? options.parent : null
      Object.defineProperty(this, 'parent', { value: parent })
      return parent
    } })
    Object.defineProperty(this, 'path', { configurable: true, get() {
      const options = this.options
      let path = (options.path) ? String(options.path) : null
      Object.defineProperty(this, 'path', { value: path })
      return path
    } })
    Object.defineProperty(this, 'key', { configurable: true, get() {
      let key = (this.path) ? this.path.split('.').pop() : null
      Object.defineProperty(this, 'key', {
         value: key
      })
      return key
    } })
    Object.defineProperty(this, 'root', { get() {
      let root = this
      iterateParents: 
      while(root) {
        if([undefined, null].includes(root.parent)) { break iterateParents }
        root = root.parent
      }
      return root
    } })
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