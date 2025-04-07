import { Coutil } from 'core-plex'
const { recursiveAssign, typedObjectLiteral } = Coutil
const ValidArrayAssigmentMethods = Object.freeze(
  ['push', 'unshift']
)
const ValidObjectAssigmentMethods = Object.freeze(
  ['assign', 'defineProperties', 'set']
)

export default function Assign($model, $properties, $options) {
  const { type } = $model
  const { assignObject, assignArray } = $options
  if(type === 'array' && ValidArrayAssigmentMethods.includes(assignArray)) {
    $model[assignArray](...$properties)
  }
  else if(['array', 'object'].includes(type) && ValidObjectAssigmentMethods.includes(assignObject)) {
    $model[assignObject]($properties)
  }
  return $model
}