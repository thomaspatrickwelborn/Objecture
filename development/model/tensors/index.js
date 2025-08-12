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
    return $receiver
  }
  else {
    let [$receiver, $property] = $arguments
    return $receiver.get($property)
  }
}
// Model Setter
function ModelSetter(...$arguments) {
  if($arguments.length === 2) {
    let [$receiver, $source] = $arguments
    $receiver.clear()
    iterateSourceEntries: 
    for(const [$sourceKey, $sourceValue] of Object.entries(source)) {
      $receiver.set($sourceKey, $sourceValue)
    }
    return $receiver
  }
  else {
    let [$receiver, $property, $value] = $arguments
    $receiver.set($property, $value)
    return $receiver.get($property)
  }
}
// Model Deleter
function ModelDeleter(...$arguments) {
  if($arguments.length === 2) {
    let [$receiver, $property] = $arguments
    return $receiver.delete($property)
  }
  else {
    let [$receiver] = $arguments
    return $receiver.clear()
  } 
}
export default {
  typeValidators: [ModelTypeValidator/*, TypeValidators.Object, TypeValidators.Map*/],
  getters: [ModelGetter/*, Getters.Object, Getters.Map*/],
  setters: [ModelSetter/*, Setters.Object, Setters.Map*/],
  deleters: [ModelDeleter/*, Deleters.Object, Deleters.Map*/],
}
