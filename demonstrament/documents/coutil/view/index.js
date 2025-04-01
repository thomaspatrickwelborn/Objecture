import { Core } from '../../../../node_modules/core-plex/distributement/core-plex.js'
export default class View extends Core {
  #settings
  #querySelectors
  constructor($settings) {
    super({
      events: $settings.events,
      enableEvents: $settings.enableEvents,
    })
    this.#settings = Object.freeze($settings)
    Object.defineProperties(this, {
      parentElement: { enumerable: true, get() { return this.settings.parentElement } },
      qs: { enumerable: true, get() { return this.querySelectors } },
      querySelectors: { enumerable: true, get() {
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
        ] of Object.entries(this.settings.querySelectors)) {
          iterateQuerySelectors: 
          for(const [
            $querySelectorName, $querySelector
          ] of Object.entries($querySelectors)) {
            const $this = this
            Object.defineProperty(querySelectors, $querySelectorName, {
              get() {
                return $this.parentElement[$querySelectorMethod]($querySelector)
              }
            })
          }
        }
        return this.#querySelectors
      } },
    })
  }
  get settings() { return this.#settings }
  get templates() { return this.settings.templates }
  render($model) {
    const defaultHTMLString = this.templates.default($model)
    const _default = this.qs.default
    if(_default) {
      for(const $default of _default) {
        $default.parentElement.removeChild($default)
      }
    }
    this.parentElement.insertAdjacentHTML('afterBegin', defaultHTMLString)
    this.reenableEvents({ enable: true })
    console.log(this.getEvents())
    this.dispatchEvent(new CustomEvent('render'))
    return this
  }
}