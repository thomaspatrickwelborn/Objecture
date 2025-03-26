export default class ValidatorEvent extends CustomEvent {
  #settings
  #content
  #key
  #path
  #value
  #valid
  constructor($type, $settings, $content) {
    super($type)
    this.#settings = $settings
    this.#content = $content
    this.#content.addEventListener(
      $type, 
      ($event) => {
        if(this.#content.parent !== null) {
          this.#content.parent.dispatchEvent(
            new ValidatorEvent(
              this.type, 
              {
                key: $event.key,
                path: $event.path,
                detail: $event.detail,
              },
              this.#content.parent
            )
          )
        }
      }, 
      {
        once: true
      }
    )
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