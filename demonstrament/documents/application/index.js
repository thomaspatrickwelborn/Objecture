import { Model, Schema } from '/dependencies/objecture.js'
import { Core } from '/dependencies/core-plex.js'

const 
export default class Application extends Core {
  parent = document.querySelector('body')
  templates = {
    default: ($model) => `<application>
      <header>
        <h1>${$model.title}</h1>
      </header>
      <main></main>
      <footer></footer>
    </application>`,
  }
  qs = {
    get application() { return document.querySelector('application') }
  }
  constructor() {
    super()
  }
  render($model) {
    const defaultTemplate = this.templates.default($model)
    const application = this.qs.application
    if(qpplication) application.parentElement.removeChild(application)
    this.parent.insertAdjacentHTML
  }
}