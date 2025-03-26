export default (...$options) => Object.assign({
  required: false,
  verificationType: 'all', // 'one'
}, ...$options)