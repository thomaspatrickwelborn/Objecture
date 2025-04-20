| [❂ Objecture](../../../README.md) | [Guide](../index.md) | [Model](../index.md) | *Events* |
| :-- | :-- | :-- | :-- |
# ⏣ Objecture Guide \| Model Events
```
{
  accessor: {
    get: {
      'get': true,
      'getProperty': true,
      'getProperty:$key': true,
    },
    set: {
      'set': true,
      'setProperty': true,
      'setProperty:$key': true,
    },
    delete: {
      'delete': true,
      'deleteProperty': true,
      'deleteProperty:$key': true,
    },
  },
  array: {
    concat: {
      'concatValue:$index': true,
      'concatValue': true,
      'concat': true,
    },
    copyWithin: {
      'copyWithinIndex:$index': true,
      'copyWithinIndex': true,
      'copyWithin': true,
    },
    fill: {
      'fillIndex:$index': true,
      'fillIndex': true,
      'fill': true,
    },
    pop: {
      'pop': true,
    },
    push: {
      'pushProp:$index': true,
      'pushProp': true,
      'push': true,
    },
    reverse: {
      'reverse': true
    },
    shift: {
      'shift': true
    },
    splice: {
      'spliceDelete:$index': true,
      'spliceDelete': true,
      'spliceAdd:$index': true,
      'spliceAdd': true,
      'splice': true,
    },
    unshift: {
      'unshiftProp:$index': true,
      'unshiftProp': true,
      'unshift': true,
    },
  },
  object: {
    assign: {
      'assignSourceProperty:$key': true,
      'assignSourceProperty': true,
      'assignSource': true,
      'assign': true,
    },
    defineProperties: {
      'defineProperties': true,
    },
    defineProperty: {
      'defineProperty': true,
      'defineProperty:$key': true,
    },
    freeze: {
      'freezeProperty': true,
      'freeze': true,
    },
    seal: {
      'sealProperty': true,
      'seal': true,
    },
  },
},
```