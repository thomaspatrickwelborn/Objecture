console.log(`
-----------
Method: set
Event: set
`)
import { Model, Schema } from '/dependencies/objecture.js'
const content = [{
  propertyA: {
    propertyB: {
      propertyC: 333
    }
  },
  propertyD: {
    propertyE: 555
  },
  propertyF: [{
    propertyG: 777
  }]
}, {
  propertyA: {
    propertyB: {
      propertyC: 333333
    }
  },
  propertyD: {
    propertyE: 555555
  },
  propertyF: [{
    propertyG: 777777
  }]
}, {
  propertyA: {
    propertyB: {
      propertyC: 333333333
    }
  },
  propertyD: {
    propertyE: 555555555
  },
  propertyF: [{
    propertyG: 777777777
  }]
}]
const context = [{
  propertyA: {
    propertyB: {
      propertyC: Number
    }
  },
  propertyD: {
    propertyE: Number
  },
  propertyF: [{
    propertyG: Number
  }]
}]
const eventDirectory = {
  '0.propertyA.propertyB': content[0].propertyA.propertyB,
  '0.propertyA': content[0].propertyA,
  '0.propertyD': content[0].propertyD,
  '0.propertyF.0': content[0].propertyF[0],
  '0.propertyF': content[0].propertyF,
  '0': content[0],

  '1.propertyA.propertyB': content[1].propertyA.propertyB,
  '1.propertyA': content[1].propertyA,
  '1.propertyD': content[1].propertyD,
  '1.propertyF.0': content[1].propertyF[0],
  '1.propertyF': content[1].propertyF,
  '1': content[1],

  '2.propertyA.propertyB': content[2].propertyA.propertyB,
  '2.propertyA': content[2].propertyA,
  '2.propertyD': content[2].propertyD,
  '2.propertyF.0': content[2].propertyF[0],
  '2.propertyF': content[2].propertyF,
  '2': content[2],

  'null': content,
}
const contentString = JSON.stringify(content)
const model = new Model(content, new Schema(context), {
  assignObject: 'set',
  assignArray: 'set',
  enableEvents: true,
  events: {
    '** set': ($event) => {
      const eventPath = $event.path
      const eventDirectoryValue = JSON.stringify(eventDirectory[eventPath])
      const eventValue = JSON.stringify($event.value)
      if(eventValue === eventDirectoryValue) {
        delete eventDirectory[eventPath]
      }
      console.log(
        `${$event.type} ${$event.path}`, 
        `(${Object.keys(eventDirectory).length} remaining events)`,
      )
    }
  },
})
console.log(`contentString === model.toString()`)
console.log(`${contentString} === ${model.toString()}`)
console.log(`${contentString === model.toString()}`)
