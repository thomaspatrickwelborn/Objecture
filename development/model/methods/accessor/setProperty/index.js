import { Coutil } from 'core-plex'
const { recursiveAssign } = Coutil
import setContent from './setContent/index.js'
import setContentProperty from './setContentProperty/index.js'
export default function setProperty($model, $options, ...$arguments) {
  let setProperty
  const options = $options
  if(typeof $arguments[0] === 'string') {
    if($arguments.length === 3) { recursiveAssign(options, $arguments[2]) }
    setProperty = setContentProperty($model, options, ...$arguments)
  }
  else {
    if($arguments.length === 2) { recursiveAssign(options, $arguments[1]) }
    setProperty = setContent($model, options, ...$arguments)
  }
  return setProperty
}