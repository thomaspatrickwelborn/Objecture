import { assign, typedObjectLiteral } from 'recourse'
// const ValidArrayAssigmentMethods = Object.freeze(
//   ['push', 'unshift']
// )
// const ValidObjectAssigmentMethods = Object.freeze(
//   ['assign', 'defineProperties', 'set']
// )

export default function Assign($model, $properties, $options) {
  const { type } = $model
  const { propertyAssignments } = $options
  if(type === 'array'/* && ValidArrayAssigmentMethods.includes(assignArray)*/) {
    $model[propertyAssignments[type]](...$properties)
  }
  else {
    $model[propertyAssignments[type]]($properties)
  }
  return $model
}