export default class ContentEvent extends CustomEvent {
  #settings
  #content
  #key
  constructor($type, $settings, $content) {
    super($type, $settings)
    this.#settings = $settings
    this.#content = $content
    if(!this.content.parent) return this
    this.content.addEventListener(
      $type, 
      ($event) => {
        const { path, value, detail, change } = $event
        this.content.parent.dispatchEvent(
          new ContentEvent(
            this.type, 
            { path, value, detail, change },
            this.content.parent
          )
        )
      }, 
      {
        once: true
      }
    )
  }
  get content() { return this.#content }
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