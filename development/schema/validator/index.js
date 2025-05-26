import { recursiveAssign } from 'recourse'
import Verification from '../verification/index.js'
import Validation from '../validation/index.js'
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
          const { definition, messages, type } = this
          let verification = new Verification({
            type: type,
            key: $key,
            value: definition.value,
            messages: recursiveAssign({}, messages, definition.messages),
          })
          const validation = definition.validate(...arguments)
          if(typeof validation === 'object') {
            verification.validation = validation
            verification.pass = validation.valid
          }
          else { verification.pass = validation }
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