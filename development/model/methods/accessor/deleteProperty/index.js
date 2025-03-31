import { Coutil } from 'core-plex'
const { recursiveAssign } = Coutil
import deleteContent from './deleteContent/index.js'
import deleteContentProperty from './deleteContentProperty/index.js'
export default function deleteProperty($model, $options, ...$arguments) {
  let deleteProperty
  const options = recursiveAssign({}, $model.options, $options)
  if(typeof $arguments[0] === 'string') {
    if($arguments.length === 2) { recursiveAssign(options, $arguments[1]) }
    deleteProperty = deleteContentProperty($model, options, ...$arguments)
  }
  else {
    if($arguments.length === 1) { recursiveAssign(options, $arguments[0]) }
    deleteProperty = deleteContent($model, options, ...$arguments)
  }
  return deleteProperty
}