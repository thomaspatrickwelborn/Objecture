export default class ModelEvent extends CustomEvent {
  #settings
  #model
  #key
  constructor($type, $settings, $model) {
    super($type, $settings)
    this.#settings = $settings
    this.#model = $model
    if(!this.model.parent) return this
  }
  get model() { return this.#model }
  get key() {
    if(this.#key !== undefined) { return this.#key }
    if(this.path) { this.#key = this.path.split('.').pop() }
    else { this.#key = null }
    return this.#key
  }
  get change() { return this.#settings.change }
  get value() { return this.#settings.value }
  get path() { return this.#settings.path }
  get detail() { return this.#settings.detail }
}