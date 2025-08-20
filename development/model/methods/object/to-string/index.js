
const Options = { space: 0, replacer: null, returnValue: 'target', nonenumerable: true }
export default function toString($model, $options) {
  const options = Object.assign({}, Options, $options)
  // REQUIREMENT: 
  // Must be able to generate string representations of Map instances

  // return JSON.stringify(
  //   $model.valueOf($model, options), options.replacer, options.space
  // )
}