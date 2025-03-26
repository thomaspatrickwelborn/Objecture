export default ($buffer) => [].concat(JSON.parse(
  JSON.stringify($buffer.toString())
))