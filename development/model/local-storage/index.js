import { defineProperties, getOwnPropertyDescriptors, impandTree } from 'recourse'
export default class LocalStorage extends EventTarget {
  #db = localStorage
  #path
  constructor($path) {
    super()
    this.path = $path
  }
  get path() { return this.#path }
  set path($path) {
    if(this.#path !== undefined) return
    this.#path = $path
  }
  get() {
    let model = this.#db.getItem(this.path)
    if(model) {
      model = defineProperties(JSON.parse(model), {
        typeCoercion: true
      })
    }
    return model
  }
  set($data) {
    return this.#db.setItem(this.path, JSON.stringify(
      getOwnPropertyDescriptors($data, {
        path: true,
        retrocursion: false,
        type: true,
      })
    ))
  }
  remove() {
    try { return this.#db.removeItem(this.path) }
    catch($err) { console.error($err) }
  }
}