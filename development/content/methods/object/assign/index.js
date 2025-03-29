import { Coutil } from 'core-plex'
const { recursiveAssign, typedObjectLiteral } = Coutil
import Content from '../../../index.js'
import Change from '../../../change/index.js'
import { ContentEvent, ValidatorEvent } from '../../../events/index.js'
export default function assign($content, $options, ...$sources) {
  const { path, target, schema } = $content
  const { events, sourceTree, enableValidation, validationEvents } = $options
  const assignedSources = []
  const assignChange = new Change({ preter: $content })
  // Iterate Sources
  iterateAssignSources: 
  for(let $source of $sources) {
    let assignedSource
    const assignSourceChange = new Change({ preter: $content })
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
          $sourceKey, $sourceValue, $source, $content
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
            $content.dispatchEvent(new ValidatorEvent($eventType, validSourceProperty, $content))
          }
        }
        if(!validSourceProperty.valid) { continue iterateSourceProperties }
      }
      // Source Prop: Object Type
      let sourceValue
      if($sourceValue && typeof $sourceValue === 'object') {
        if($sourceValue instanceof Content) {
          sourceValue = $sourceValue.valueOf()
        }
        // Subschema
        let subschema
        if(schema?.type === 'array') { subschema = schema.context[0] }
        else if(schema?.type === 'object') { subschema = schema.context[$sourceKey] }
        else { subschema = null }
        // Content
        const contentPath = (path)
          ? [path, $sourceKey].join('.')
          : String($sourceKey)
        let contentTypedLiteral = typedObjectLiteral($sourceValue)
        // Assignment
        // Source Tree: False
        if(sourceTree === false) {
          sourceValue = new Content(contentTypedLiteral, subschema, 
            recursiveAssign({}, $content.options, {
              path: contentPath,
              parent: $content,
            })
          )
        }
        // Source Tree: true
        else {
          // Assignment: Existing Content Instance
          if(target[$sourceKey] instanceof Content) {
            sourceValue = target[$sourceKey]
          }
          // Assignment: New Content Instance
          else {
            sourceValue = new Content(contentTypedLiteral, subschema, 
              recursiveAssign({}, $content.options, {
                path: contentPath,
                parent: $content,
              })
            )
          }
        }
        const assignment = { [$sourceKey]: sourceValue }
        Object.assign(target, assignment)
        Object.assign(assignedSource, assignment)
        $content.retroReenableEvents()
        sourceValue.assign($sourceValue)
      }
      // Source Prop: Primitive Type
      else {
        sourceValue = $sourceValue
        const assignment = { [$sourceKey]: sourceValue }
        Object.assign(target, assignment)
        Object.assign(assignedSource, assignment)
        $content.retroReenableEvents()
      }
      if(events) {
        const contentEventPath = (path) ? [path, $sourceKey].join('.') : String($sourceKey)
        if(events['assignSourceProperty:$key']) {
          const type = ['assignSourceProperty', $sourceKey].join(':')
          assignSourcePropertyKeyChange.anter = target[$sourceKey]
          $content.dispatchEvent(
            new ContentEvent(type, {
              path: contentEventPath,
              value: sourceValue,
              change: assignSourcePropertyKeyChange,
              detail: {
                source: assignedSource,
              }
            }, $content)
          )
        }
        if(events['assignSourceProperty']) {
          assignSourcePropertyChange.anter = target[$sourceKey]
          $content.dispatchEvent(
            new ContentEvent('assignSourceProperty', {
              path: contentEventPath,
              value: sourceValue,
              change: assignSourcePropertyChange,
              detail: {
                source: assignedSource,
              }
            }, $content)
          )
        }
      }
    }
    assignedSources.push(assignedSource)
    // Content Event: Assign Source
    if(events && events['assignSource']) {
      assignSourceChange.anter = $content
      $content.dispatchEvent(
        new ContentEvent('assignSource', {
          path,
          change: assignSourceChange,
          detail: {
            source: assignedSource,
          },
        }, $content)
      )
    }
  }
  // Content Event: Assign
  if(events && events['assign']) {
    assignChange.anter = $content
    $content.dispatchEvent(
      new ContentEvent('assign', { 
        path,
        change: assignChange,
        detail: {
          sources: assignedSources,
        },
      }, $content)
    )
  }
  return $content
}