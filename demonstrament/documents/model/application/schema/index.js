// import { Model, Schema } from '/dependencies/objecture.js'
import { createJSONEditor } from '../../../../../node_modules/vanilla-jsoneditor/standalone.js'
import { View } from '../../../coutil/index.js'
export default class Schema extends View {
  constructor($settings) {
    super({
      parentElement: $settings.parentElement,
      parent: $settings.parent,
      path: $settings.path,
      templates: {
        default: ($models) => {
          const { content, ui } = $models
          return `
            <schema>
              <header>
                <input
                  type="checkbox"
                  ${(ui.checked) ? "checked" : ""}
                />
                <h2>${ui.headline}</h2>
              </header>
              <capture></capture>
            </schema>
          `
        },
      },
      querySelectors: {
        querySelector: {
          capture: ':scope > schema > capture',
          header: ':scope > schema > header', 
          active: ':scope > schema > header > input',
        }
      },
      enableEvents: true,
      events: {
        'render': function() {
          this.editor
        },
        'qs.active change': function($event) {
          this.models.ui.set("checked", !this.models.ui.get("checked"))
        },
        'models.ui set:checked': function($event) {
          const checked = $event.detail.value
          console.log("checked", checked)
          if(checked) { this.editor }
          else {
            this.qs.capture.innerHTML = ''
            this.#editor = undefined
          }
        }
      },
      models: {
        editor: {
          text: '{}',
        },
        ui: {
          headline: 'Schema',
          checked: false,
        },
      },
      localStorage: { path: '/model/application/schema' },
    })
  }
  #editor
  get editor() {
    if(
      this.#editor !== undefined ||
      this.models.ui.get('checked') === false
    ) { return this.#editor }
    this.#editor = createJSONEditor({
      target: this.qs.capture,
      props: {
        mode: 'text',
        mainMenuBar: false,
        navigationBar: false,
        content: {
          text: this.models.editor.get('text'),
        },
        onChange: function($updatedContent, $previousContent, { contentErrors, patchResult }) {
          if(!contentErrors) {
            this.dispatchEvent(
              new CustomEvent('editor:change', { detail: $updatedContent })
            )
          }
        }.bind(this)
      }
    })
  }
}