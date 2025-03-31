import { Coutil } from 'core-plex'
const { recursiveAssign, typedObjectLiteral } = Coutil
import Model from '../../../index.js'
import Change from '../../../change/index.js'
import { ModelEvent, ValidatorEvent } from '../../../events/index.js'
export default function assign($model, $options, ...$sources) {
  const { path, target, schema } = $model
  const { events, sourceTree, enableValidation, validationEvents } = $options
  const assignedSources = []
  const assignChange = new Change({ preter: $model })
  // Iterate Sources
  iterateAssignSources: 
  for(let $source of $sources) {
    let assignedSource
    const assignSourceChange = new Change({ preter: $model })
    if(Array.isArray($source)) { assignedSource = [] }
    else if(typeof $source === 'object') { assignedSource = {} }
    // Iterate Source Propertiess
    iterateSourceProperties:
    for(let [$sourceKey, $sourceValue] of Object.entries($source)) {
      const assignSourcePropertyChange = new Change({ preter: target[$sourceKey] })
      const assignSourcePropertyKeyChange = new Change({ preter: target[$sourceKey] })
      // Validation
      if(schema && enableValidation) {
        const validSourceProperty = schema.validateProperty(
          $sourceKey, $sourceValue, $source, $model
        )
        if(validationEvents) {
          let type, propertyType
          const validatorEventPath = (path) ? [path, $sourceKey].join('.') : String($sourceKey)
          if(validSourceProperty.valid) {
            type = 'validProperty'
            propertyType = ['validProperty', $sourceKey].join(':')
          }
          else {
            type = 'nonvalidProperty'
            propertyType = ['nonvalidProperty', $sourceKey].join(':')
          }
          for(const $eventType of [type, propertyType]) {
            $model.dispatchEvent(new ValidatorEvent($eventType, validSourceProperty, $model))
          }
        }
        if(!validSourceProperty.valid) { continue iterateSourceProperties }
      }
      // Source Prop: Object Type
      let sourceValue
      if($sourceValue && typeof $sourceValue === 'object') {
        if($sourceValue instanceof Model) {
          sourceValue = $sourceValue.valueOf()
        }
        // Subschema
        let subschema
        if(schema?.type === 'array') { subschema = schema.context[0] }
        else if(schema?.type === 'object') { subschema = schema.context[$sourceKey] }
        else { subschema = null }
        // Model
        const modelPath = (path)
          ? [path, $sourceKey].join('.')
          : String($sourceKey)
        let modelTypedLiteral = typedObjectLiteral($sourceValue)
        // Assignment
        // Source Tree: False
        if(sourceTree === false) {
          sourceValue = new Model(modelTypedLiteral, subschema, 
            recursiveAssign({}, $model.options, {
              path: modelPath,
              parent: $model,
            })
          )
        }
        // Source Tree: true
        else {
          // Assignment: Existing Model Instance
          if(target[$sourceKey] instanceof Model) {
            sourceValue = target[$sourceKey]
          }
          // Assignment: New Model Instance
          else {
            sourceValue = new Model(modelTypedLiteral, subschema, 
              recursiveAssign({}, $model.options, {
                path: modelPath,
                parent: $model,
              })
            )
          }
        }
        const assignment = { [$sourceKey]: sourceValue }
        Object.assign(target, assignment)
        Object.assign(assignedSource, assignment)
        $model.retroReenableEvents()
        sourceValue.assign($sourceValue)
      }
      // Source Prop: Primitive Type
      else {
        sourceValue = $sourceValue
        const assignment = { [$sourceKey]: sourceValue }
        Object.assign(target, assignment)
        Object.assign(assignedSource, assignment)
        $model.retroReenableEvents()
      }
      if(events) {
        const modelEventPath = (path) ? [path, $sourceKey].join('.') : String($sourceKey)
        if(events['assignSourceProperty:$key']) {
          const type = ['assignSourceProperty', $sourceKey].join(':')
          assignSourcePropertyKeyChange.anter = target[$sourceKey]
          $model.dispatchEvent(
            new ModelEvent(type, {
              path: modelEventPath,
              value: sourceValue,
              change: assignSourcePropertyKeyChange,
              detail: {
                source: assignedSource,
              }
            }, $model)
          )
        }
        if(events['assignSourceProperty']) {
          assignSourcePropertyChange.anter = target[$sourceKey]
          $model.dispatchEvent(
            new ModelEvent('assignSourceProperty', {
              path: modelEventPath,
              value: sourceValue,
              change: assignSourcePropertyChange,
              detail: {
                source: assignedSource,
              }
            }, $model)
          )
        }
      }
    }
    assignedSources.push(assignedSource)
    // Model Event: Assign Source
    if(events && events['assignSource']) {
      assignSourceChange.anter = $model
      $model.dispatchEvent(
        new ModelEvent('assignSource', {
          path,
          change: assignSourceChange,
          detail: {
            source: assignedSource,
          },
        }, $model)
      )
    }
  }
  // Model Event: Assign
  if(events && events['assign']) {
    assignChange.anter = $model
    $model.dispatchEvent(
      new ModelEvent('assign', { 
        path,
        change: assignChange,
        detail: {
          sources: assignedSources,
        },
      }, $model)
    )
  }
  return $model
}