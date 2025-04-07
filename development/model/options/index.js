import { Coutil } from 'core-plex'
const { recursiveAssign } = Coutil
export default ($options) => recursiveAssign({
  path: null, 
  parent: null, 
  enableValidation: true, 
  validationEvents: {
    'validProperty:$key': true,
    'validProperty': true,
    'nonvalidProperty:$key': true,
    'nonvalidProperty': true,
  },
  pathkey: true,
  subpathError: false,
  assignMethod: 'set', 
  methods: {
    accessor: {
      get: {
        events: {
          'get': true,
          'getProperty': true,
          'getProperty:$key': true,
        },
      },
      set: {
        recursive: true,
        events: {
          'set': true,
          'setProperty': true,
          'setProperty:$key': true,
        },
      },
      delete: {
        events: {
          'delete': true,
          'deleteProperty': true,
          'deleteProperty:$key': true,
        },
      },
    },
    array: {
      concat: {
        events: {
          'concatValue:$index': true,
          'concatValue': true,
          'concat': true,
        }
      },
      copyWithin: {
        events: {
          'copyWithinIndex:$index': true,
          'copyWithinIndex': true,
          'copyWithin': true,
        }
      },
      fill: {
        events: {
          'fillIndex:$index': true,
          'fillIndex': true,
          'fill': true,
        }
      },
      pop: {
        events: { 'pop': true  },
      },
      push: {
        events: {
          'pushProp:$index': true,
          'pushProp': true,
          'push': true,
        }
      },
      reverse: {
        events: { 'reverse': true  },
      },
      shift: {
        events: { 'shift': true  },
      },
      splice: {
        events: {
          'spliceDelete:$index': true,
          'spliceDelete': true,
          'spliceAdd:$index': true,
          'spliceAdd': true,
          'splice': true,
        }
      },
      unshift: {
        events: {
          'unshiftProp:$index': true,
          'unshiftProp': true,
          'unshift': true,
        }
      },
    },
    object: {
      assign: {
        sourceTree: true,
        events: {
          'assignSourceProperty:$key': true,
          'assignSourceProperty': true,
          'assignSource': true,
          'assign': true,
        },
      },
      defineProperties: {
        descriptorTree: true,
        events: { 'defineProperties': true },
      },
      defineProperty: {
        descriptorTree: true,
        events: {
          'defineProperty': true,
          'defineProperty:$key': true,
        },
      },
      freeze: {
        recursive: true,
        events: {
          'freezeProperty': true,
          'freeze': true,
        },
      },
      seal: {
        recursive: true,
        events: {
          'sealProperty': true,
          'seal': true,
        },
      },
    },
  },
}, $options)