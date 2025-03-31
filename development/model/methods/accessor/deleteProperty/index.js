import { Coutil } from 'core-plex'
const { recursiveAssign } = Coutil
import deleteModel from './deleteModel/index.js'
import deleteModelProperty from './deleteModelProperty/index.js'
export default function deleteProperty($model, $options, ...$arguments) {
  let deleteProperty
  const options = recursiveAssign({}, $model.options, $options)
  if(typeof $arguments[0] === 'string') {
    if($arguments.length === 2) { recursiveAssign(options, $arguments[1]) }
    deleteProperty = deleteModelProperty($model, options, ...$arguments)
  }
  else {
    if($arguments.length === 1) { recursiveAssign(options, $arguments[0]) }
    deleteProperty = deleteModel($model, options, ...$arguments)
  }
  return deleteProperty
}