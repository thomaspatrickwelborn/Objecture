import { Coutil } from 'core-plex'
const { recursiveAssign } = Coutil
import Verification from '../verification/index.js'
const Messages = {
  'true': ($verification) => `${$verification.pass}`,
  'false': ($verification) => `${$verification.pass}`,
}
export default class Validator extends EventTarget {
  constructor($definition = {}, $schema) {
    super()
    const definition = Object.freeze(
      Object.assign({ messages: Messages }, $definition)
    )
    Object.defineProperties(this, {
      'definition': { value: definition },
      'schema': { value: $schema },
      'type': { value: definition.type },
      'messages': { value: definition.messages },
      'validate': { configurable: true, get() {
        function validate($key, $value, $source, $target) {
          const { definition, messages, type} = this
          const verification = new Verification({
            type: type,
            definition: definition,
            key: $key,
            value: $value,
            messages: recursiveAssign({}, messages, definition.messages),
          })
          verification.pass = definition.validate(...arguments)
          return verification
        }
        const boundValidate = validate.bind(this)
        Object.defineProperty(this, 'validate', {
          value: boundValidate
        })
        return boundValidate
      } },
    })
  }
}