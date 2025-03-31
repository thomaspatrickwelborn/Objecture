export default class ValidatorEvent extends CustomEvent {
  #settings
  #model
  #key
  #path
  #value
  #valid
  constructor($type, $settings, $model) {
    super($type)
    this.#settings = $settings
    this.#model = $model
  }
  get key() {
    if(this.#key !== undefined) { return this.#key }
    this.#key = this.#settings.key
    return this.#key
  }
  get path() {
    if(this.#path !== undefined) { return this.#path }
    this.#path = this.#settings.path
    return this.#path
  }
  get value() {
    if(this.#value !== undefined) { return this.#value }
    this.#value = this.#settings.value
    return this.#value
  }
  get valid() {
    if(this.#valid !== undefined) { return this.#valid }
    this.#valid = this.#settings.valid
    return this.#valid
  }
}