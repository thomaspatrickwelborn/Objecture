import { assign } from 'recourse'
const verificationTypes = ['all', 'one']
export default (...$options) => Object.assign({
  required: false,
  verificationType: verificationTypes[0], 
  strict: false,
  properties: {
    type: 'type',
    value: 'value',
  },
}, ...$options)