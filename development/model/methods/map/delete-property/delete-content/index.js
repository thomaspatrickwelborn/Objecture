import { ModelEvent } from '../../../../events/index.js'
export default function deleteContent($model, $options) {
  const { receiver } = $model
  for(const [$receiverPropertyKey, $receiverPropertyValue] of Object.entries(receiver)) {
    $model.delete($receiverPropertyKey, $options)
  }
  const { path } = $model
  const { mutatorEvents } = $options
  if(mutatorEvents && mutatorEvents['delete']) {
    $model.dispatchEvent(
      new ModelEvent('delete', {
        path,
        detail: {
          value: $model.valueOf()
        }
      }, $model)
    )
  }
  return $model
}