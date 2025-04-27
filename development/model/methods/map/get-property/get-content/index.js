import { ModelEvent } from '../../../../events/index.js'
export default function getContent($model, $options) {
  const { path } = $model
  const { mutatorEvents } = $options
  if(mutatorEvents && mutatorEvents['get']) {
    $model.dispatchEvent(
      new ModelEvent('get', {
        path,
        value: $model.valueOf(),
        detail: {
          value: $model.valueOf()
        }
      }, $model)
    )
  }
  return $model
}