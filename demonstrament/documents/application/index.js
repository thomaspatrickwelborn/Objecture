// import { Model, Schema } from '/dependencies/objecture.js'
import { View } from '../coutil/index.js'
import Properties from './properties/index.js'
export default class Application extends View {
  constructor($settings) {
    super({
      parentElement: $settings.parentElement,
      templates: {
        default: ($model) => `
          <application>
            <header>
              <h1>${$model.title}</h1>
            </header>
            <main></main>
            <footer></footer>
          </application>
        `,
      },
      querySelectors: {
        querySelector: {
          main: ':scope > application > main'
        }
      },
      enableEvents: true,
      events: {
        'render': function render($event) {
          console.log($event)
        }
      },
    })
  }
  #properties
  get properties() {
    if(this.#properties !== undefined) { return this.#properties }
    this.#properties = new Properties({
      parentElement: this.qs.main
    })
    return this.#properties
  }
}