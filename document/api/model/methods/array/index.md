# Array Traps
**MVC Framework \| Class System \| Model \| Model \| Handler \| Traps \| *Array***  
**Model**  
 - [Array Handler Trap Options]()
   - [`concat` Options]()
     - [ `concat.events` Option]()
   - [`copyWithin` Options]()
     - [ `copyWithin.events` Option]()
   - [`fill` Options]()
     - [ `fill.events` Option]()
   - [`pop` Options]()
     - [ `pop.events` Option]()
   - [`push` Options]()
     - [ `push.events` Option]()
   - [`reverse` Options]()
     - [ `reverse.events` Option]()
   - [`shift` Options]()
     - [ `shift.events` Option]()
   - [`splice` Options]()
     - [ `splice.events` Option]()
   - [`unshift` Options]()
     - [ `unshift.events` Option]()
 - [Array Handler Trap Methods]()
   - [`concat` Method]()
     - [`concat` Arguments]()
   - [`copyWithin` Method]()
     - [`copyWithin` Arguments]()
   - [`fill` Method]()
     - [`fill` Arguments]()
   - [`pop` Method]()
     - [`pop` Arguments]()
   - [`push` Method]()
     - [`push` Arguments]()
   - [`reverse` Method]()
     - [`reverse` Arguments]()
   - [`shift` Method]()
     - [`shift` Arguments]()
   - [`splice` Method]()
     - [`splice` Arguments]()
   - [`unshift` Method]()
     - [`unshift` Arguments]()

## Array Handler Trap Options
Array Handler Trap Options are defined with new `Model` Instance creation.  
```
import { Model } from 'mvc-framework'
const $modelOptions = {
  methods: {
    array: {
      concat: {
        events: {
          'concatElement': true,
          'concat': true
        ]
      },
      copyWithin: {
        events: {
          'copyWithinIndex': true,
          'copyWithin': true
        ]
      },
      fill: {
        events: {
          'fillIndex': true,
          'fill': true
        ]
      },
      pop: {
        events: {
          'pop': true
        }
      },
      push: {
        events: [
          'pushElement',
          'push'
        ]
      },
      reverse: {
        events: {
          'reverse': true
        }
      },
      shift: {
        events: {
          'shift': true
        }
      },
      splice: {
        events: {
          'spliceDeleteElement': true,
          'spliceAddElement': true,
          'splice': true
        }
      },
      unshift: {
        events: {
          'unshiftElement': true,
          'unshift': true
        }
      },
    }
  }
}
const model = new Model([], null, $modelOptions)
```

### `concat` Options
#### `concat.events` Option

### `copyWithin` Options
#### `copyWithin.events` Option

### `fill` Options
#### `fill.events` Option

### `pop` Options
#### `pop.events` Option

### `push` Options
#### `push.events` Option

### `reverse` Options
#### `reverse.events` Option

### `shift` Options
#### `shift.events` Option

### `splice` Options
#### `splice.events` Option

### `unshift` Options
#### `unshift.events` Option

## Array Handler Trap Methods
### `concat` Method
#### `concat` Arguments
### `copyWithin` Method
#### `copyWithin` Arguments
### `fill` Method
#### `fill` Arguments
### `pop` Method
#### `pop` Arguments
### `push` Method
#### `push` Arguments
### `reverse` Method
#### `reverse` Arguments
### `shift` Method
#### `shift` Arguments
### `splice` Method
#### `splice` Arguments
### `unshift` Method
#### `unshift` Arguments