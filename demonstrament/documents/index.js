import { Schema, Content } from '/dependencies/objecture.js'
function eventLog($event) { console.log($event.type, $event.path) }
const object = new Content({
  propertyA: { propertyB: { propertyC: { propertyD: true } } },
  propertyE: [
    { propertyF: false }, { propertyF: false }, { propertyF: false }
  ]
}, null, {
  addEvents: {
    // -----
    // 'assign': eventLog,
    // 'assignSource': eventLog,
    // 'assignSourceProperty': eventLog,
    // -----
    // 'propertyA.propertyB.propertyC assignSourceProperty': eventLog,
    ':scope assignSourceProperty': eventLog,
    '** assignSourceProperty': eventLog,
    // 'propertyA.propertyB assignSourceProperty': eventLog,
    // 'propertyA assignSourceProperty': eventLog,
    // 'assignSourceProperty': eventLog,
    // 'propertyA.propertyB.propertyC assignSource': eventLog,
    // 'propertyA.propertyB.propertyC assignSourceProperty': eventLog,
    // 'propertyE.[0-9] assign': eventLog,
  },
  enableEvents: true,
  assignmentMethod: 'assign',
})
// .enableEvents()
// object.get('propertyA.propertyB.propertyC').assign({ propertyD: false })
// object.get('propertyA.propertyB.propertyC').assign({ propertyD: false })
// object.get('propertyA.propertyB.propertyC').assign({ propertyD: false })


console.log("Assignment 1")
object.assign({ propertyA: { propertyB: { propertyC: { propertyD: true } } } })
object.disableEvents()
console.log("No Assignment")
object.assign({ propertyA: { propertyB: { propertyC: { propertyD: true } } } })
object.enableEvents()
console.log("Assignment 2")
object.assign({ propertyA: { propertyB: { propertyC: { propertyD: true } } } })
console.log("Assignment 3")
object.assign({ propertyA: { propertyB: { propertyC: { propertyG: true } } } })
object.disableEvents()
console.log("No Assignment")
object.assign({ propertyA: { propertyB: { propertyC: { propertyD: true } } } })
console.log("No Assignment")
object.assign({ propertyA: { propertyB: { propertyC: { propertyD: true } } } })
object.enableEvents()
console.log("Assignment 4")
object.assign({ propertyI: false })
object.assign({ propertyI: true })

// object.assign({ propertyA: { propertyB: { propertyC: { propertyD: true } } } })
// object.assign({ propertyA: { propertyB: { propertyC: { propertyD: true } } } })
// object.assign({ propertyA: { propertyB: { propertyC: { propertyD: true } } } })
// const propertyC = object.get('propertyA.propertyB.propertyC')
// propertyC.dispatchEvent(customEvent)
// propertyC.dispatchEvent(customEvent)
// object.enableEvents()
// object.assign({ propertyA: { propertyB: { propertyC: { propertyE: false } } } })

// object.enableEvents()
// object.assign({ propertyA: { propertyB: { propertyC: { propertyE: false } } } })
// object.assign({ propertyA: { propertyB: { propertyC: { propertyE: false } } } })

// object.enableEvents()
// object.assign({ propertyA: { propertyB: { propertyC: { propertyE: false } } } })
// object.assign({ propertyA: { propertyB: { propertyC: { propertyE: false } } } })

// object.enableEvents()
// object.assign({ propertyA: { propertyB: { propertyC: { propertyE: false } } } })
// object.assign({ propertyA: { propertyB: { propertyC: { propertyE: false } } } })

// object.enableEvents()
// object.assign({ propertyA: { propertyB: { propertyC: { propertyD: true } } } })
// object.enableEvents()
// object.assign({ propertyA: { propertyB: { propertyC: { propertyD: true } } } })

// object.enableEvents()
// object.assign({ propertyA: { propertyB: { propertyC: { propertyD: true } } } })
// object.enableEvents()
// object.assign({ propertyA: { propertyB: { propertyC: { propertyD: true } } } })


// object.assign({ propertyA: { propertyB: { propertyC: { propertyD: true } } } })
// object.assign({ propertyA: { propertyB: { propertyC: { propertyD: true } } } })
// object.assign({ propertyA: { propertyB: { propertyC: { propertyD: true } } } })
// object.assign({ propertyA: { propertyB: { propertyC: { propertyD: true } } } })
// console.log("-----")
// console.log("-----")
// object.assign({ propertyA: { propertyB: { propertyC: { propertyD: false }}}})
// console.log("-----")
// object.assign({ propertyA: { propertyB: { propertyC: { propertyD: true }}}})
// object.assign({ propertyA: { propertyB: { propertyC: { propertyD: false }}}})
// object.assign({ propertyA: { propertyB: { propertyC: { propertyD: false }}}})
// object.assign({ propertyA: { propertyB: { propertyC: { propertyD: false }}}})
