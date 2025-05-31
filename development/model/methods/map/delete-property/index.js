import { assign } from 'recourse'
import deleteContent from './delete-content/index.js'
import deleteContentProperty from './delete-content-property/index.js'
export default function deleteProperty($model, $options, ...$arguments) {
  let deleteProperty
  const options = $options
  if(typeof $arguments[0] === 'string') {
    if($arguments.length === 2) { assign(options, $arguments[1]) }
    deleteProperty = deleteContentProperty($model, options, ...$arguments)
  }
  else {
    if($arguments.length === 1) { assign(options, $arguments[0]) }
    deleteProperty = deleteContent($model, options, ...$arguments)
  }
  return deleteProperty
}