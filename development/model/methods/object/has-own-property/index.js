import { tensors } from 'recourse'
export default function hasOwnProperty($model, $options, $property) {
  return Object.hasOwnProperty($model.target, $property)
}