import { assign } from 'recourse'
export default (...$options) => Object.assign({
  required: false,
  verificationType: 'all', 
  // verificationType: 'one',
  strict: false,
  properties: {
    type: 'type',
    value: 'value',
  },
}, ...$options)