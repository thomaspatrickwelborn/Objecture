
import { Model, Schema } from '/dependencies/objecture.js'
import { View } from '../../../coutil/index.js'
export default class Statements extends View {
  constructor($settings) {
    super({
      parentElement: $settings.parentElement,
      parent: $settings.parent,
      path: $settings.path,
      templates: {
        default: ($models) => {
          const { content } = this.models
          return `
            <statements>
              <h2>${content.headline}</h2>
              <navigation>
              </navigation>
              <collect>
              </collect
            </statements>
          `
        },
      },
      querySelectors: {
        querySelector: {}
      },
      enableEvents: true,
      events: {},
      models: {
        content: {
          headline: 'Schema',
        },
      },
      localStorage: { path: '/model/application/statements' },
    })
  }
}