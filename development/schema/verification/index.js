export default class Verification extends EventTarget {
  constructor($settings) {
    super()
    const settings = Object.assign({}, $settings)
    Object.defineProperties(this, {
      'type': { value: settings.type },
      'definition': { value: settings.definition },
      'key': { value: settings.key },
      'value': { value: settings.value },
      'path': { value: settings.path },
      'message': { configurable: true, get() {
        let message
        if(this.pass !== undefined) {
          message = settings.messages[String(this.pass)](this)
          Object.defineProperty(this, 'message', { value: message })
        }
        return message
      } },
      'pass': { writable: true, 
        set pass($pass) {
          Object.defineProperty(this, 'pass', { value: $pass })
        },
      },
    })
  }
}