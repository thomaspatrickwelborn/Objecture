import { Model, Schema } from '/dependencies/objecture.js'
import { View } from '../../coutil/index.js'
import PropertiesView from './properties/index.js'
import SchemaView from './schema/index.js'
import StatementsView from './statements/index.js'
export default class ModelView extends View {
  #properties
  #schema
  constructor($settings) {
    super({
      parentElement: document.querySelector('body'),
      parent: null,
      path: '/model',
      templates: {
        default: ($models) => {
          const ui = $models.ui
          return `
            <application>
              <header>
                <h1>${ui.headline}</h1>
              </header>
              <main></main>
              <footer></footer>
            </application>
          `
        },
      },
      querySelectors: {
        querySelector: {
          main: ':scope > application > main'
        }
      },
      enableEvents: true,
      events: {
        'render': function($event) {
          this.properties.render()
          this.schema.render()
        },
        'properties.models.editor set:text': function($event) {
          console.log($event.type, $event.detail)
        },
        'schema.models.editor set:text': function($event) {
          console.log($event.type, $event.detail)
        },
      },
      models: { 
        ui: {
          headline: 'Objecture',
        }
      },
    })
    Object.defineProperties(this, {
      'properties': { enumerable: true, get() {
        if(this.#properties !== undefined) { return this.#properties }
        this.#properties = new PropertiesView({
          insertAdjacentPosition: 'beforeEnd',
          parentElement: this.qs.main,
          parent: this,
          path: [this.path, 'properties'].join('/'),
        })
        return this.#properties
      } },
      'schema': { enumerable: true, get() {
        if(this.#schema !== undefined) { return this.#schema }
        this.#schema = new SchemaView({
          insertAdjacentPosition: 'beforeEnd',
          parentElement: this.qs.main,
          parent: this,
          path: [this.path, 'schema'].join('/'),
        })
        return this.#schema
      } },
    })
  }
}