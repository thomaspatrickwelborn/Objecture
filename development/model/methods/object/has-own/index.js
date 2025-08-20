import { tensors } from 'recourse'
export default function hasOwn($model, $options, $property) {
  return Object.hasOwn($model.target, $property)
}