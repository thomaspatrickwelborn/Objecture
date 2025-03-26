const Messages = {
  'true': ($validation) => `${$validation.valid}`,
  'false': ($validation) => `${$validation.valid}`,
}
export default class Validation extends EventTarget {
  #settings
  #properties
  #valid
  #advance = []
  #deadvance = []
  #unadvance = []
  constructor($settings = {}) {
    super()
    this.#settings = Object.assign({ messages: Messages }, $settings)
  }
  // get type() { return this.#settings.type }
  get definition() { return this.#settings.definition }
  get path() { return this.#settings.path }
  get key() { return this.#settings.key }
  get value() { return this.#settings.value }
  get properties() {
    if(this.#properties !== undefined) return this.#properties
    this.#properties = this.#settings.properties
    return this.#properties
  }
  get advance() { return this.#advance }
  get deadvance() { return this.#deadvance }
  get unadvance() { return this.#unadvance }
  get valid() { return this.#valid }
  set valid($valid) {
    if(this.#valid === undefined) {
      this.#valid = $valid
    }
  }
}