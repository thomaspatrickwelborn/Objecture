import { tensors } from 'recourse'
const {
  TypeValidators, Tensors, Getters, Setters, Deleters
} = tensors
import { Model } from '../../index.js'
// Model Type Validator
const ModelTypeValidator = ($target) => ($target instanceof Model)
// Model Getter
function ModelGetter(...$arguments) {
  if($arguments.length === 1) {
    let [$receiver] = $arguments
    // ----->
    return $receiver
  }
  else {
    let [$receiver, $property] = $arguments
    // ----->
    return $receiver.target[$property]
  }
}
// Model Setter
function ModelSetter(...$arguments) {
  if($arguments.length === 2) {
    let [$receiver, $source] = $arguments
    ModelDeleter(...$arguments)
    iterateSourceEntries: 
    for(const [$sourceKey, $sourceValue] of Object.entries(source)) {
      $receiver.target[$sourceKey] = $sourceValue
    }
    // ----->
    return $receiver
  }
  else {
    let [$receiver, $property, $value] = $arguments
    $receiver.target[$property] = $value
    // ----->
    return $receiver.target[$property]
  }
}
// Model Deleter
function ModelDeleter(...$arguments) {
  if($arguments.length === 2) {
    let [$receiver, $property] = $arguments
    delete $receiver.target[$property]
    // ----->
    return $receiver.target[$property]
  }
  else {
    for(const [$propertyKey, $propertyDescriptor] of Object.entries(
      Object.getOwnPropertyDescriptors($receiver.target)
    )) {
      const { enumerable, configurable, writable } = $propertyDescriptor
      if(configurable) {
        Object.defineProperty($receiver.target, $propertyKey, {
          configurable: true, value: undefined
        })
        delete $receiver.target[$propertyKey]
      }
    }
    // ----->
    return
  } 
}

export default {
  typeValidators: [TypeValidators.Object, TypeValidators.Map],
  getters: [Getters.Object, Getters.Map],
  setters: [Setters.Object, Setters.Map],
  deleters: [Deleters.Object, Deleters.Map],
}

// export default {
//   typeValidators: [ModelTypeValidator/*, TypeValidators.Object, TypeValidators.Map*/],
//   getters: [ModelGetter/*, Getters.Object, Getters.Map*/],
//   setters: [ModelSetter/*, Setters.Object, Setters.Map*/],
//   deleters: [ModelDeleter/*, Deleters.Object, Deleters.Map*/],
// }
