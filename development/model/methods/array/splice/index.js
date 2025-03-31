import Model from '../../../index.js'
import { ModelEvent } from '../../../events/index.js'
export default function splice($model, $options) {
  const { events } = $options
  const { target, path, schema } = $model
  const { enableValidation, validationEvents } = $options
  const $arguments = [...arguments]
  const $start = ($arguments[0] >= 0)
    ? $arguments[0]
    : target.length + $arguments[0]
  const $deleteCount = ($arguments[1] <= 0)
    ? 0
    : (
      $arguments[1] === undefined ||
      $start + $arguments[1] >= target.length
    ) ? target.length - $start
      : $arguments[1]
  const $addItems = $arguments.slice(2)
  const addCount = $addItems.length
  const deleteItems = []
  let deleteItemsIndex = 0
  spliceDelete:
  while(deleteItemsIndex < $deleteCount) {
    const deleteItem = Array.prototype.splice.call(target, $start, 1)[0]
    // $model.enableEvents({ enable: true })
    deleteItems.push(deleteItem)
    // Array Splice Delete Event
    if(events) {
      const modelEventPath = (path)
        ? [path, deleteItemsIndex].join('.')
        : String(deleteItemsIndex)
      if(events['spliceDelete']) {
        $model.dispatchEvent(
          new ModelEvent('spliceDelete', {
            path: modelEventPath,
            value: deleteItem,
            detail: {
              index: $start + deleteItemsIndex,
              deleteIndex: deleteItemsIndex,
              deleteItem: deleteItem,
            },
          }, $model)
        )
      }
      if(events['spliceDelete:$index']) {
        const type = ['spliceDelete', ':', deleteItemsIndex].join('')
        $model.dispatchEvent(
          new ModelEvent(type, {
            path: modelEventPath,
            value: deleteItem,
            detail: {
              index: $start + deleteItemsIndex,
              deleteIndex: deleteItemsIndex,
              deleteItem: deleteItem,
            },
          }, $model)
        )
      }
    }
    deleteItemsIndex++
  }
  let addItemsIndex = 0
  spliceAdd: 
  while(addItemsIndex < addCount) {
    let addItem = $addItems[addItemsIndex]
    // Validation
    if(schema && enableValidation) {
      const validAddItem = schema.validateProperty(elementIndex, element, {}, $model)
      if(validationEvents) {
        let type, propertyType
        const validatorEventPath = (path)
          ? [path, addItemsIndex].join('.')
          : String(addItemsIndex)
        // $model.enableEvents({ enable: true })
        if(validAddItem.valid) {
          type = 'validProperty'
          propertyType = ['validProperty', ':', addItemsIndex].join('')
        }
        else {
          type = 'nonvalidProperty'
          propertyType = ['nonvalidProperty', ':', addItemsIndex].join('')
        }
        for(const $eventType of [type, propertyType]) {
          $model.dispatchEvent(new ValidatorEvent($eventType, validAddItem, $model))
        }
      }
      if(!validAddItem.valid) { addItemsIndex++; continue spliceAdd }
    }
    const modelPath = (path)
      ? [path, addItemsIndex].join('.')
      : String(addItemsIndex)
    let startIndex = $start + addItemsIndex
    // Add Item: Object Type
    if(typeof addItem === 'object') {
      if(addItem instanceof Model) { addItem = addItem.valueOf() }
      const subschema = schema?.context[0] || null
      addItem = new Model(addItem, subschema, {
        path: modelPath,
        parent: $model,
      })
      Array.prototype.splice.call(target, startIndex, 0, addItem)
    }
    // Add Item: Primitive Type
    else {
      Array.prototype.splice.call(target, startIndex, 0, addItem)
    }
    // $model.enableEvents({ enable: true })
    // Array Splice Add Event
    if(events) {
      const modelEventPath = (path)
        ? [path, addItemsIndex].join('.')
        : String(addItemsIndex)
      if(events['spliceAdd']) {
        $model.dispatchEvent(
          new ModelEvent('spliceAdd', {
            path: modelEventPath,
            value: addItem,
            detail: {
              index: $start + addItemsIndex,
              addIndex: addItemsIndex,
              addItem: addItem,
            },
          }, $model)
        )
      }
      if(events['spliceAdd:$index']) {
        const type = ['spliceAdd', ':', addItemsIndex].join('')
        $model.dispatchEvent(
          new ModelEvent(type, {
            path: modelEventPath,
            value: addItem,
            detail: {
              index: $start + addItemsIndex,
              addIndex: addItemsIndex,
              addItem: addItem,
            },
          }, $model)
        )
      }
    }
    addItemsIndex++
  }
  // Array Splice Event
  if(events && events['splice']) {
    $model.dispatchEvent(
      new ModelEvent('splice', {
        path,
        detail: {
          $start,
          deleted: deleteItems,
          added: $addItems,
          length: target.length,
        },
      },
      $model)
    )
  }
  return deleteItems
}