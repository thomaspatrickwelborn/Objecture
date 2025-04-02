// import { Model, Schema } from '/dependencies/objecture.js'
import { createJSONEditor } from '../../../../../node_modules/vanilla-jsoneditor/standalone.js'
import { View } from '../../../coutil/index.js'
export default class Properties extends View {
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
        'render': function() {
          this.editor
        },
        'editor:change': function($event) {
          console.log($event)
          this.models.editor.set('text', $event.detail.text)
          this.models.editor.set('json', JSON.parse($event.detail.text))
        },
      },
      models: {
        editor: {
          text: '{}',
          json: {},
        },
        ui: {
          headline: 'Properties',
        }
      },
      localStorage: { path: '/model/application/properties' },
    })
  }
  #editor
  get editor() {
    if(this.#editor !== undefined) { return this.#editor }
    this.#editor = createJSONEditor({
      target: this.qs.capture,
      props: {
        mode: 'text',
        mainMenuBar: false,
        navigationBar: false,
        content: {
          json: this.models.editor.get('json'),
        },
        onChange: function($updatedContent, $previousContent, { contentErrors, patchResult }) {
          if(!contentErrors) {
            console.log('editor:change', { detail: $updatedContent })
            this.dispatchEvent(
              new CustomEvent('editor:change', { detail: $updatedContent })
            )
          }
        }.bind(this),
      },
    })
  }
}