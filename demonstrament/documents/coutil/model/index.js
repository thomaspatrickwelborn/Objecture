import { Core, Coutil } from '../../../../node_modules/core-plex/distributement/core-plex.js'
const { accessors, typedObjectLiteral, typeOf, variables } = Coutil
const Accessors = [($target, $property) => {
  if($property === undefined) { return $target.target }
  else { return $target.get($property) }
}]
export default class Model extends Core {
  #path
  #localStorage
  #properties
  #options
  #target
  #parent
  constructor($properties = {}, $options = {
    enableEvents: true,
    events: {},
    path: null,
    localStorage: null,
  }) {
    super({
      events: $options.events,
      enableEvents: $options.enableEvents,
      accessors: Accessors,
    })
    this.#properties = $properties
    Object.defineProperties(this, {
      target: { get () {
        if(this.#target !== undefined) return this.#target
        this.#target = typedObjectLiteral(this.#properties)
        return this.#target
      } },
    })
    this.#options = $options
    const setValue = Object.assign({}, this.#properties, this.load())
    this.set(setValue)
  }
  get parent() {
    if(this.#parent !== undefined) { return this.#parent }
    this.#parent = this.#options.parent || null
    return this.#parent
  }
  get root() {
    let root = this
    while(root?.parent ) {
      root = root.parent
    }
    return root
  }
  get localStorage() {
    if(this.#localStorage !== undefined) { return this.#localStorage }
    const path = this.path
    let localStoragePath
    if(path) {
      localStoragePath = [this.#options.localStorage, this.path.split('.').join('/')].join('/')
    }
    else {
      localStoragePath = this.#options.localStorage || '/'
    }
    this.#localStorage = localStoragePath
    return this.#localStorage
  }
  get path() {
    if(this.#path !== undefined) { return this.#path }
    let path
    if(this.#options.path) { path = this.#options.path }
    else { path = null }
    this.#path = path
    return this.#path
  }
  #basekey($path) {
    if(!$path) { return null }
    return $path.split('.').at(-1)
  }
  #basemodel($model, $path) {
    let model = $model
    if(!$path) { return model }
    const keys = $path.split('.')
    if(keys.length <= 1) { return model }
    iteratePathKeys: 
    for(const $key of keys.slice(0, -1)) {
      if(model instanceof Model) {
        model = model.get($key)
      }
      else { break iteratePathKeys }
    }
    return model
  }
  get() {
    const getPath = arguments[0]
    if(getPath) {
      const model = this.#basemodel(this, getPath)
      const key = this.#basekey(getPath)
      if(model === this) {
        return this.target[key]
      }
      if(key) {
        return model.get(key)
      } 
    }
    else { return this }
  }
  set() {
    if(arguments.length === 1) {
      const $properties = arguments[0]
      const target = this.target
      iterateProperties: 
      for(const [$key, $value] of Object.entries($properties)) {
        let propertyPath
        if(this.path) { propertyPath = [this.path, $key].join('.') }
        else { propertyPath = $key }
        const propertyDetail = {
          path: propertyPath,
          key: $key,
          value: $value,
        }
        const typeOfValue = typeOf($value)
        let value
        if(variables.PrimitiveKeys.includes(typeOfValue)) {
          value = $value
          target[$key] = value
        }
        else if(variables.ObjectKeys.includes(typeOfValue)) {
          value = new Model(typedObjectLiteral($value), {
            parent: this,
            path: propertyPath,
            enableEvents: this.#options.enableEvents,
            localStorage: this.#options.localStorage,
          })
          target[$key] = value
          value.set($value)
        }
        this.retroReenableEvents()
        this.save()
        this.dispatchEvent(new CustomEvent(`set:${$key}`, { detail: propertyDetail }))
        this.dispatchEvent(new CustomEvent('setProperty', { detail: propertyDetail }))
      }
      this.dispatchEvent(new CustomEvent('set', { detail: {
        path: this.path,
        value: this.valueOf(),
      } }))
      return this
    }
    else if(arguments.length === 2) {
      const target = this.target
      const $path = arguments[0]
      const $value = arguments[1]
      const model = this.#basemodel(this, $path)
      const key = this.#basekey($path)
      let value
      let propertyPath
      if(model.path) { propertyPath = [model.path, key].join('.') }
      else { propertyPath = key }
      const propertyDetail = {
        path: propertyPath,
        key,
      }
      const typeOfValue = typeOf($value)
      if(variables.PrimitiveKeys.includes(typeOfValue)) {
        if(model === this) { target[key] = $value }
        else { model.set(key, $value) }
        propertyDetail.value = $value
      }
      else if(variables.ObjectKeys.includes(typeOfValue)) {
        const prevalue = model.get(key)
        if(prevalue instanceof Model) {
          prevalue.set($value)
          value = prevalue
          propertyDetail.value = value.valueOf()
        }
        else {
          value = new Model(typedObjectLiteral($value), {
            parent: model,
            path: propertyPath, 
            enableEvents: this.#options.enableEvents,
            localStorage: this.#options.localStorage,
          })
          value.set($value)
          if(model === this) {
            target[key] = value
            propertyDetail.value = target[key].valueOf()
          }
          else {
            model.set(key, value)
            propertyDetail.value = model.valueOf()
          }
        }
      }
      const detail = {
        path: propertyPath,
        key: key,
        value: $value,
      }
      this.retroReenableEvents()
      this.save()
      this.dispatchEvent(new CustomEvent(`set:${key}`, { detail }))
      this.dispatchEvent(new CustomEvent('setProperty', { detail }))
      this.dispatchEvent(new CustomEvent('set', { detail: {
        key: this.path,
        value: this.valueOf(),
      } }))
      return target[key]
    }
  }
  delete() {
    if(arguments.length === 1) {
      const deletePath = arguments[0]
      const model = this.#basemodel(this, deletePath)
      const key = this.#basekey(deletePath)
      const propertyPath = [model.path, key].join('/')
      if(model === this) { delete this.target[$key] }
      else { model.delete(key) }
      const detail = {
        path: propertyPath,
        key: key,
      }
      this.save()
      this.dispatchEvent(new CustomEvent(`delete:${$key}`), { detail })
      this.dispatchEvent(new CustomEvent(`deleteProperty`), { detail })
    }
    else {
      const target = this.target
      for(const $key of Object.keys(target)) {
        const propertyPath = [this.path, $key].join('/')
        delete target[$key]
        const detail = {
          path: propertyPath,
          key: $key,
        }
        this.save()
        this.dispatchEvent(new CustomEvent(`delete:${$key}`), { detail })
        this.dispatchEvent(new CustomEvent('deleteProperty'), { detail })
      }
      this.dispatchEvent(new CustomEvent('delete'), { detail })
    }
    return this
  }
  retroReenableEvents() {
    let model = this
    while(model) {
      model.reenableEvents({ enable: true })
      model = model.parent
    }
    return this
  }
  load() { return JSON.parse(localStorage.getItem(this.localStorage)) }
  save() {
    for(const $value of Object.values(this.target)) {
      if($value instanceof Model) { $value.save() }
    }
    return localStorage.setItem(this.localStorage, this.toString())
  }
  valueOf() {
    const valueOf = typedObjectLiteral(this.target)
    iterateTargetProperties: 
    for(const [
      $targetKey, $targetValue
    ] of Object.entries(this.target)) {
      let targetValue
      if($targetValue instanceof Model) {
        targetValue = $targetValue.valueOf()
      }
      else { targetValue = $targetValue }
      valueOf[$targetKey] = targetValue
    }
    return valueOf
  }
  toString($options) {
    const options = Object.assign({
      spaces: 2,
      replacer: null,
    }, $options)
    return JSON.stringify(this.valueOf(), options.replacer, options.spacer)
  }
}