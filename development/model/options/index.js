import { assign } from 'recourse'
import tensors from '../tensors/index.js'
const Methods = {
  map: {
    get: {
      mutatorEvents: {
        'get': true,
        'getProperty': true,
        'getProperty:$key': true,
      },
    },
    set: {
      recursive: true,
      mutatorEvents: {
        'set': true,
        'setProperty': true,
        'setProperty:$key': true,
      },
    },
    delete: {
      mutatorEvents: {
        'delete': true,
        'deleteProperty': true,
        'deleteProperty:$key': true,
      },
    },
  },
  array: {
    concat: {
      mutatorEvents: {
        'concatElement:$index': true,
        'concatElement': true,
        'concat': true,
      }
    },
    copyWithin: {
      mutatorEvents: {
        'copyWithinElement:$index': true,
        'copyWithinElement': true,
        'copyWithin': true,
      }
    },
    fill: {
      lengthen: true,
      mutatorEvents: {
        'fillElement:$index': true,
        'fillElement': true,
        'fill': true,
      }
    },
    pop: {
      mutatorEvents: { 'pop': true  },
    },
    push: {
      mutatorEvents: {
        'pushElement:$index': true,
        'pushElement': true,
        'push': true,
      }
    },
    reverse: {
      mutatorEvents: { 'reverse': true  },
    },
    shift: {
      mutatorEvents: { 'shift': true  },
    },
    splice: {
      mutatorEvents: {
        'spliceDeleteElement:$index': true,
        'spliceDeleteElement': true,
        'spliceAddElement:$index': true,
        'spliceAddElement': true,
        'splice': true,
      }
    },
    unshift: {
      mutatorEvents: {
        'unshiftElement:$index': true,
        'unshiftElement': true,
        'unshift': true,
      }
    },
  },
  object: {
    assign: {
      mutatorEvents: {
        'assignSourceProperty:$key': true,
        'assignSourceProperty': true,
        'assignSource': true,
        'assign': true,
      },
      sourceTree: true,
      targetTypedObjectLiteral: false,
    },
    defineProperties: {
      descriptorTree: true,
      mutatorEvents: { 'defineProperties': true },
    },
    defineProperty: {
      descriptorTree: true,
      mutatorEvents: {
        'defineProperty': true,
        'defineProperty:$key': true,
      },
    },
    freeze: {
      recursive: true,
      mutatorEvents: {
        'freezeProperty': true,
        'freeze': true,
      },
    },
    seal: {
      recursive: true,
      mutatorEvents: {
        'sealProperty': true,
        'seal': true,
      },
    },
    toString: {
      space: 0,
      replacer: null,
    },
  },
}
const PropertyAssignments = {
  object: 'set', 
  array: 'set', 
  map: 'set', 
  set: 'add', 
}
const ValidationEvents = {
  'validProperty:$key': true,
  'validProperty': true,
  'nonvalidProperty:$key': true,
  'nonvalidProperty': true,
}
export default ($options) => assign({
  autoload: false, 
  autosave: false, 
  enableEvents: false,
  enableValidation: true, 
  localStorage: false, 
  methods: Methods,
  nonenumerable: false, 
  parent: null, 
  path: null, 
  pathkey: true,
  pathMatch: false, 
  pathParseInteger: false,
  propertyAssignments: PropertyAssignments,
  subpathError: false,
  tensors,
  validationEvents: ValidationEvents,
}, $options)