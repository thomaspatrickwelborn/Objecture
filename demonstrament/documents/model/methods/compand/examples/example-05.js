console.log("------------------------")
console.log("Compand Tree | Example 5")
console.log("------------------------")
import { Recourse } from '/dependencies/recourse.js'
const app = {
  parentElement: document.querySelector('body'),
  template: `
    <app>
      <nav class="menu">
        <button data-id="menu-a">Menu A</button>
        <button data-id="menu-b">Menu B</button>
        <button data-id="menu-c">Menu C</button>
      </nav>
      <nav class="section">
        <button data-id="section-a">Section A</button>
        <button data-id="section-b">Section B</button>
        <button data-id="section-c">Section C</button>
      </nav>
    </app>
  `,
  qs: Object.defineProperties({}, {
    app: { get() { return document.querySelector('app') }, enumerable: true },
    menuButton: { get() { return document.querySelectorAll('app > nav.menu > button') }, enumerable: true },
    sectionButton: { get() { return document.querySelectorAll('app > nav.section > button') }, enumerable: true },
  }),
  render: function() {
    const app = this.qs.app
    if(app) app.removeChild()
    this.parentElement.insertAdjacentHTML('afterbegin', this.template)
    return this
  }
}
app.render()
console.log("\n",
  "app.qs.app", Recourse.get(app, 'qs.app'), "\n", 
  "app.qs.menuButton", Recourse.get(app, 'qs.menuButton'), "\n", 
  "app.qs.menuButton", Recourse.get(app, 'qs.menuButton'), "\n", 
)
console.log("pass", (
  (app.qs.app instanceof HTMLElement) &&
  (app.qs.menuButton.length === 3) &&
  (app.qs.menuButton.length === 3)
))
