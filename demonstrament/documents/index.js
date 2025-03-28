import { Schema, Content } from '/dependencies/objecture.js'
function eventLog($event) { console.log($event.type, $event.path) }
const object = new Content({
  propertyA: { propertyB: { propertyC: { propertyD: true } } },
  propertyE: [
    { propertyF: false }, { propertyF: false }, { propertyF: false }
  ]
}, null, {
  addEvents: {
    // 'assign': eventLog,
    // 'propertyA.propertyB.propertyC assign': eventLog,
    'propertyE.[0-9] assign': eventLog,
  },
  enableEvents: true,
  assignmentMethod: 'assign',
})
console.log(object.toString())
// object.addEvents({
//   // 'assign': eventLog,
//   // 'propertyA.propertyB.propertyC assign': eventLog,
//   'propertyE.[0-9] assign': eventLog,
// })
// .enableEvents()
// console.log(object.toString({ space: 2, replacer: null }))
// console.log(object.getEvents({ enable: true}))
// object.addEvents({
//   'assign': eventLog,
//   'propertyA.propertyB.propertyC assign': eventLog,
//   'propertyE.[0-9] assign': eventLog,
// }).enableEvents()
// object.addEventListener('assign', eventLog)
object.assign({
  propertyA: { propertyB: { propertyC: { propertyD: true } } },
  propertyE: [
    { propertyF: false }, { propertyF: false }, { propertyF: false }
  ]
})
// object.disableEvents()
// object.assign({
//   propertyA: { propertyB: { propertyC: { propertyD: true } } },
//   propertyE: [
//     { propertyF: false }, { propertyF: false }, { propertyF: false }
//   ]
// })
// object.assign({
//   propertyA: { propertyB: { propertyC: { propertyD: true } } },
//   propertyE: [
//     { propertyF: false }, { propertyF: false }, { propertyF: false }
//   ],
// })