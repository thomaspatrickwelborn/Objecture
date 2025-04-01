// import { Model, Schema } from '/dependencies/objecture.js'
import { View } from '../../coutil/index.js'
export default class Properties extends View {
  constructor($settings) {
    super({
      parentElement: $settings.parentElement,
      templates: {
        default: ($model) => `
          <properties>
            PROPERTIES
          </properties>
        `,
      },
      querySelectors: {
        querySelector: {}
      },
      enableEvents: true,
      events: {},
    })
  }
}