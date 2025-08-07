import { Recourse } from '/dependencies/recourse.js'
console.log("------------------------")
console.log("Compand Tree | Example 3")
console.log("------------------------")
const map = new Map([
  [777, 777], [777777, 777777], [777777777, 777777777]
])
const mapCompand = Recourse.compand(map, {
  values: true, // returnValue: 'target'
})
let mapCompandString
let rangeErrorPass
try {
  mapCompandString = Recourse.toString(map, { space: 2, replacer: null, returnValue: 'target' })
}
catch($err) {
  // if($err.message === 'Uncaught RangeError: Invalid string length') { rangeErrorPass = true }
  mapCompandString = JSON.stringify(Recourse.valueOf(map, { space: 2, replacer: null, returnValue: 'target' }))
}
// const mapCompandString = Recourse.toString(Array.from(map.entries()), { space: 2, replacer: null })
console.log(mapCompand)
console.log('mapCompandString', mapCompandString)
console.log("pass", `{
  "777": 777,
  "777777": 777777,
  "777777777": 777777777
}` === mapCompandString)