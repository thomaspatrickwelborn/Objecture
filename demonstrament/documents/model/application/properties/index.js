import Editor from '../editor/index.js'
import { View } from '../../../coutil/index.js'
export default class Properties extends View {
  #editor
  constructor($settings) {
    super({
      parentElement: $settings.parentElement,
      parent: $settings.parent,
      path: $settings.path,
      templates: {
        default: ($models) => {
          const { ui } = $models
          return `
            <properties>
              <h2>${ui.headline}</h2>
              <capture></capture>
            </properties>
          `
        },
      },
      querySelectors: {
        querySelector: {
          capture: ':scope > properties > capture',
        }
      },
      enableEvents: true,
      events: {
        'render': function($event) {
          console.log($event)
          // this.editor
        },
        'editor change': function($event) {
          this.models.editor.set('text', $event.detail.text)
          this.models.editor.save()
        },
      },
      models: {
        editor: {
          text: '{}',
        },
        ui: {
          headline: 'Properties',
        }
      },
    })
    Object.defineProperties(this, {
      editor: { enumerable: true, get() {
        if(this.#editor !== undefined) { return this.#editor }
        this.#editor = new Editor({
          parentElement: this.qs.capture,
          parent: this,
          path: [this.path, 'editor'].join('.'),
          insertAdjacentPosition: 'afterbegin',
          models: {
            ui: { name: 'model-properties-editor' },
            content: { text: this.models.editor.get('text') },
          },
        })
        return this.#editor
      }
    } })
  }
}