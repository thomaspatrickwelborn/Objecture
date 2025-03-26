import Content from '../index.js'
export default class Change {
  #_keyter = false 
  #_preter = false 
  #_anter = false 
  #_conter = false
  #keyter
  #preter
  #anter
  #conter
  constructor($settings = {}) {
    for(const [$key, $value] of Object.entries($settings)) { this[$key] = $value }
  }
  get preter() { return this.#preter }
  set preter($preter) {
    if(this.#_preter === true) { return this.#preter }
    if($preter instanceof Content) { this.#preter = $preter.valueOf() }
    else { this.#preter = $preter }
    this.#_preter = true
  }
  get anter() { return this.#anter }
  set anter($anter) {
    if(this.#_anter === true) { return this.#anter }
    if($anter instanceof Content) { this.#anter = $anter.valueOf() }
    else { this.#anter = $anter }
    this.#_anter = true
  }
  get conter() {
    if(
      this.#_conter === true ||
      [this.#_preter, this.#_anter].includes(false)
    ) { return this.#conter }
    const preter = JSON.stringify(this.preter)
    const anter = JSON.stringify(this.anter)
    console.log("preter",preter)
    console.log("anter",anter)
    let conter
    if(anter !== preter) { conter = true }
    else { conter = false }
    this.#conter = conter
    this.#_conter = true
    return this.#conter
  }
}