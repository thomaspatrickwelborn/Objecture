import { Core, Coutil } from 'core-plex'
const { typedObjectLiteral, typeOf } = Coutil
import Schema from '../schema/index.js'
import Options from './options/index.js'
import ContentEvent from './events/content/index.js'
import Methods from './methods/index.js'

export default class Content extends Core {
  #_properties
  #options
  #schema
  #type
  #target
  #parent
  #key
  #path
  #_handler
  constructor($properties = {}, $schema = null, $options = {}) {
    super({
      accessors: [($target, $property) => $target.get($property)]
    })
    this.#properties = $properties
    this.#options = Options($options)
    this.schema = $schema
    Methods(this)
    const { contentAssignmentMethod } = this.options
    this[contentAssignmentMethod](this.#properties)
  }
  get #properties() { return this.#_properties }
  set #properties($properties) {
    if(this.#_properties !== undefined) return
    if($properties instanceof Content) {
      this.#_properties = $properties.valueOf()
    }
    this.#_properties = $properties
    return this.#_properties
  }
  get options() { return this.#options }
  get schema() { return this.#schema }
  set schema($schema) {
  if(this.#schema !== undefined)  { return }
    const typeOfSchema = typeOf($schema)
    if(['undefined', 'null'].includes(typeOfSchema)) { this.#schema = null }
    else if(
      $schema instanceof Schema
    ) { this.#schema = $schema }
    else if(typeOfSchema === 'array') { this.#schema = new Schema(...arguments) }
    else if(typeOfSchema === 'object') { this.#schema = new Schema($schema) }
  }
  get classToString() { return Content.toString() }
  get type() {
    if(this.#type !== undefined) return this.#type
    this.#type = typeOf(this.#properties)
    return this.#type
  }
  get parent() {
    if(this.#parent !== undefined)  return this.#parent
    this.#parent = (this.options.parent) ? this.options.parent : null
    return this.#parent
  }
  get root() {
    let root = this
    iterateParents: 
    while(root) {
      if([undefined, null].includes(root.parent)) { break iterateParents }
      root = root.parent
    }
    return root
  }
  get key() {
    if(this.#key !== undefined) { return this.#key }
    if(this.path) { this.#key = this.path.split('.').pop() }
    else { this.#key = null }
    return this.#key
  }
  get path() {
    if(this.#path !== undefined)  return this.#path
    this.#path = (this.options.path)
      ? String(this.options.path)
      : null
    return this.#path
  }
  get target() {
    if(this.#target !== undefined) return this.#target
    this.#target = typedObjectLiteral(this.#properties)
    return this.#target
  }
  parse($settings = {
    type: 'object', // string
    replacer: null,
    space: 0,
  }) {
    let parsement = typedObjectLiteral(this.type)
    for(const [
      $propertyDescriptorName, $propertyDescriptor
    ] of Object.entries(
      Object.getOwnPropertyDescriptors(this.target))
    ) {
      const { enumerable, value, writable, configurable } = $propertyDescriptor
      if($propertyDescriptor.value instanceof Content) {
        Object.defineProperty(parsement, $propertyDescriptorName, {
          enumerable, value: value.parse({ type: 'object' }), writable, configurable
        })
      }
      else {
        Object.defineProperty(parsement, $propertyDescriptorName, {
          enumerable, value, writable, configurable
        })
      }
    }
    const { type, replacer, space } = $settings
    if(type === 'object') { return parsement }
    else if(type === 'string') { return JSON.stringify(parsement, replacer, space) }
    else { return undefined }
  }
}