import { Core } from '/dependencies/core-plex.js'
export default class Instance extends Core {
  constructor() {
    super()
  }
  templates = {
    default: ($content) => {}
  }
}