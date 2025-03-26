import { Coutil } from 'core-plex'
const { recursiveAssign } = Coutil
import setContent from './setContent/index.js'
import setContentProperty from './setContentProperty/index.js'
export default function setProperty($content, $options, ...$arguments) {
  let setProperty
  const options = recursiveAssign({}, $content.options, $options)
  if(typeof $arguments[0] === 'string') {
    if($arguments.length === 3) { recursiveAssign(options, $arguments[2]) }
    setProperty = setContentProperty($content, options, ...$arguments)
  }
  else {
    if($arguments.length === 2) { recursiveAssign(options, $arguments[1]) }
    setProperty = setContent($content, options, ...$arguments)
  }
  return setProperty
}