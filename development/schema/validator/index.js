import { Coutil } from 'core-plex'
const { recursiveAssign } = Coutil
import Verification from '../verification/index.js'
const Messages = {
  'true': ($verification) => `${$verification.pass}`,
  'false': ($verification) => `${$verification.pass}`,
}
export default class Validator extends EventTarget {
  #boundValidate
  #definition
  #schema
  constructor($definition = {}, $schema) {
    super()
    this.definition = Object.freeze(
      Object.assign({ messages: Messages }, $definition)
    )
    this.schema = $schema
  }
  get definition() { return this.#definition }
  set definition($definition) { this.#definition = $definition }
  get schema() { return this.#schema }
  set schema($schema) {
    if(this.#schema !== undefined) { return this.#schema }
    this.#schema = $schema
    return this.#schema
  }
  get type() { return this.definition.type }
  get messages() { return this.definition.messages }
  get validate() {
    function validate($key, $value, $source, $target) {
      const definition = this.definition
      const verification = new Verification({
        type: this.type,
        definition: definition,
        key: $key,
        value: $value,
        messages: recursiveAssign({}, this.messages, definition.messages),
      })
      verification.pass = definition.validate(...arguments)
      return verification
    }
    this.#boundValidate = validate.bind(this)
    return this.#boundValidate
  }
}