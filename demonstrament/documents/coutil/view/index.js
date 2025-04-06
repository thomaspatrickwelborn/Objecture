import { Core, Coutil } from '../../../../node_modules/core-plex/distributement/core-plex.js'
import { Model } from '../index.js'
const Accessors = [($target, $property) => {
  if($property === undefined) { return $target }
  else { return $target[$property] }
}, ($target, $property) => {
  if($property === undefined) { return $target.target }
  else { return $target.get($property) }
}]
export default class View extends Core {
  #settings
  #querySelectors
  #models
  constructor($settings) {
    super({
      events: $settings.events,
      enableEvents: $settings.enableEvents,
      accessors: Accessors,
    })
    $settings = Object.assign({ insertAdjacentPosition: 'beforeEnd' }, $settings)
    this.#settings = Object.freeze($settings)
    Object.defineProperties(this, {
      'insertAdjacentPosition': { enumerable: false, get() { return this.settings.insertAdjacentPosition }},
      'parentElement': { enumerable: true, get() { return this.settings.parentElement } },
      'parent': { enumerable: true, get() { return this.settings.parent } },
      'path': { enumerable: false, get() { return this.settings.path } },
      'qs': { enumerable: true, get() { return this.querySelectors } },
      'querySelectors': { enumerable: true, get() {
        if(this.#querySelectors !== undefined) { return this.#querySelectors }
        this.#querySelectors = {}
        const querySelectors = this.#querySelectors
        const querySelectorSettings = Object.assign({
          querySelectorAll: {},
        }, this.settings.querySelectors)
        querySelectorSettings.querySelectorAll = Object.assign({
          default: ':scope > *'
        }, querySelectorSettings.querySelectorAll)
        iterateQuerySelectorMethods: 
        for(const [
          $querySelectorMethod, $querySelectors
        ] of Object.entries(this.settings.querySelectors || {})) {
          iterateQuerySelectors: 
          for(const [
            $querySelectorName, $querySelector
          ] of Object.entries($querySelectors)) {
            const $this = this
            Object.defineProperty(querySelectors, $querySelectorName, {
              enumerable: true,
              get() {
                console.log($this.parentElement)
                return $this.parentElement[$querySelectorMethod]($querySelector)
              }
            })
          }
        }
        return this.#querySelectors
      } },
      'models': { enumerable: true, get() {
        if(this.#models === undefined) {
          this.#models = this.settings.models || {}
          for(const [$modelName, $model] of Object.entries(this.#models)) {
            const path = [this.path, $modelName].join('.')
            this.#models[$modelName] = new Model($model, {
              // parent: this,
              path, 
              enableEvents: $settings.enableEvents,
              localStorage: $settings.localStorage,
            })
          }
        }
        return this.#models
      } },
    })
  }
  get root() {
    let root = this
    while(root?.parent ) {
      root = root.parent
    }
    return root
  }
  get settings() { return this.#settings }
  get templates() { return this.settings.templates }
  render($template) {
    const models = Object.assign({}, this.models)
    for(const [$modelName, $model] of Object.entries(this.models)) {
      models[$modelName] = $model.valueOf()
    }
    const template = this.templates[$template] || this.templates.default
    const defaultHTMLString = this.templates.default(models)
    const _default = this.qs.default
    if(_default) {
      for(const $default of _default) {
        $default.parentElement.removeChild($default)
      }
    }
    this.parentElement.insertAdjacentHTML(this.settings.insertAdjacentPosition, defaultHTMLString)
    this.retroReenableEvents()
    this.dispatchEvent(new CustomEvent('render'))
    return this
  }
  retroReenableEvents() {
    let view = this
    while(view) {
      view.reenableEvents({ enable: true })
      view = view.parent
    }
    return this
  }
}