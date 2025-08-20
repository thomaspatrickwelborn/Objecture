export default function hasOwn($model, $options, $property) {
  return $model.target.has($property)
}