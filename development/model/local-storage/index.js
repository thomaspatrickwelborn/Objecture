import { Coutil } from 'core-plex'
const { recursiveGetOwnPropertyDescriptors, impandTree } = Coutil
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
    console.log(this.path)
    // impandTree(propertyValue, 'value')
    try{ return JSON.parse(this.#db.getItem(this.path)) }
    catch($err) { console.error($err) }
  }
  set($data) {
    try { return this.#db.setItem(this.path, JSON.stringify($data)) }
    catch($err) { console.error($err) }
  }
  remove() {
    try { return this.#db.removeItem(this.path) }
    catch($err) { console.error($err) }
  }
}