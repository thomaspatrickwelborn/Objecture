import { Coutil } from 'core-plex'
const { recursiveAssign } = Coutil
export default ($options) => {
  const Options = recursiveAssign({
    path: null, 
    parent: null, 
    enableEvents: false,
    enableValidation: true, 
    validationEvents: {
      'validProperty:$key': true,
      'validProperty': true,
      'nonvalidProperty:$key': true,
      'nonvalidProperty': true,
    },
    pathkey: true,
    subpathError: false,
    assignObject: 'set', 
    assignArray: 'set', 
    methods: {
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
            'concatValue:$index': true,
            'concatValue': true,
            'concat': true,
          }
        },
        copyWithin: {
          mutatorEvents: {
            'copyWithinIndex:$index': true,
            'copyWithinIndex': true,
            'copyWithin': true,
          }
        },
        fill: {
          lengthen: true,
          mutatorEvents: {
            'fillIndex:$index': true,
            'fillIndex': true,
            'fill': true,
          }
        },
        pop: {
          mutatorEvents: { 'pop': true  },
        },
        push: {
          mutatorEvents: {
            'pushProp:$index': true,
            'pushProp': true,
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
            'spliceDelete:$index': true,
            'spliceDelete': true,
            'spliceAdd:$index': true,
            'spliceAdd': true,
            'splice': true,
          }
        },
        unshift: {
          mutatorEvents: {
            'unshiftProp:$index': true,
            'unshiftProp': true,
            'unshift': true,
          }
        },
      },
      object: {
        assign: {
          sourceTree: true,
          mutatorEvents: {
            'assignSourceProperty:$key': true,
            'assignSourceProperty': true,
            'assignSource': true,
            'assign': true,
          },
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
      },
    },
  }, $options)
  return Options
}