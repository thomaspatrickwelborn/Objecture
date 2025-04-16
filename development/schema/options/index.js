export default (...$options) => Object.assign({
  required: false,
  verificationType: 'all', 
  // verificationType: 'one',
}, ...$options)