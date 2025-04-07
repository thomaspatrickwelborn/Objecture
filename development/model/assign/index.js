const ValidArrayAssigmentMethods = Object.freeze(
  ['assign', 'defineProperties', 'set']
)

export default function Assign($model, $properties, $options) {
  const { type } = $model
  const { assignMethod } = $options
  if(ValidArrayAssigmentMethods.includes(assignMethod)) {
    $model[assignMethod]($properties)
  }
  return $model
}