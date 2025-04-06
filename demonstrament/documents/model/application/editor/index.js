import { View } from '../../../coutil/index.js'

export default class Editor extends View {
  constructor($settings = {}) {
    super({
      parentElement: $settings.parentElement,
      insertAdjacentPosition: $settings.insertAdjacentPosition,
      templates: {
        default: ($models) => {
          return `
            <editor
              contenteditable="true"
              autocorrect="false"
              spellcheck="false"
              data-name="${$models.ui.name}"
            >${$models.content.text}</editor>
          `
        },
      },
      enableEvents: true,
      querySelectors: {
        querySelector: {
          editor: `:scope > editor[data-name="${$settings.models.ui.name}"`
        },
      },
      models: {
        content: $settings.models.content,
        ui: $settings.models.ui,
      },
      events: {
        'qs.editor input': function($event) {
          const editorInnerText = this.qs.editor.innerText
          try {
            const json = JSON.parse(editorInnerText)
            const text = JSON.stringify(json)
            this.dispatchEvent(new CustomEvent('change', {
              detail: { json, text },
            }))
          }
          catch($err) { console.error($err) }
        },
      },
    })
  }
}