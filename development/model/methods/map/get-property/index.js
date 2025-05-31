import { assign } from 'recourse'
import getContent from './get-content/index.js'
import getContentProperty from './get-content-property/index.js'
export default function getProperty($model, $options, ...$arguments) {
  let getProperty
  const options = $options
  if(typeof $arguments[0] === 'string') {
    if($arguments.length === 2) { assign(options, $arguments[1]) }
    getProperty = getContentProperty($model, options, ...$arguments)
  }
  else {
    if($arguments.length === 1) { assign(options, $arguments[0]) }
    getProperty = getContent($model, options, ...$arguments)
  }
  return getProperty
}