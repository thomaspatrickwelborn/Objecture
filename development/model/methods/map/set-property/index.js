import { assign } from 'recourse'
import setContent from './set-content/index.js'
import setContentProperty from './set-content-property/index.js'
export default function setProperty($model, $options, ...$arguments) {
  let setProperty
  const options = $options
  if(typeof $arguments[0] === 'string') {
    if($arguments.length === 3) { assign(options, $arguments[2]) }
    setProperty = setContentProperty($model, options, ...$arguments)
  }
  else {
    if($arguments.length === 2) { assign(options, $arguments[1]) }
    setProperty = setContent($model, options, ...$arguments)
  }
  return setProperty
}