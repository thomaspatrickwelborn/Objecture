import Application from '../application/index.js'

const application = new Application({
  parentElement: document.querySelector('body')
}).render({
  title: 'Objecture'
})
