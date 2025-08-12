import {
  /*defineProperties, entities, getOwnPropertyDescriptors, 
  tensors, typedObjectLiteral, typeOf, */ variables, 
} from 'recourse'
const { ObjectKeys } = variables
export default function valueOf($model, $options = {}) {
  return $model.target
  // const modelEntries = $model.entries()
  // iterateModelEntries: 
  // for(const [$modelKey, $modelValue] of $model.entries()) {
  //   if($modelValue instanceof $model.constructor) {

  //   }
  // }
  // const options = Object.assign({}, $options)
  // if(options.returnValue === 'receiver') { return $source }
  // else {
  //   const target = typedObjectLiteral(typeOf($source))
  //   return defineProperties(target, getOwnPropertyDescriptors($source, $options))
  // }
}``