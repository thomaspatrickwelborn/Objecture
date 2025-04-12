> [!WARNING]  
> Early Stage Development  

> [!CAUTION]  
> Use At Own Risk  

> [!NOTE]  
> Interested in Objecture? 
> thomas.patrick.welborn@outlook.com

# Objecture
**Object Watcher, Property Manager**  
Capture property changes for object, array mutator methods.  
## Introduction
 - Manage structured content using familiar JS `Object`, `Array`, `EventTarget` APIs.  
 - Schematize data structures with property validators.  
 - Capture **content *and* validation events** for property changes (includes **nested** property events).  

## Impetus
 - Frontend, backend applications often require or benefit from structured content with validatable schema.  
 - Changes to structured content often result in some futher change to a visual interface or database, including changes to nested properties.  
 - There are limited libraries with Browser/NodeJS compatibility that manage schematized content with validators or capture nested property change events.  

## Impact
 - Manage structured content for primitive/non-primitive data types: 
   - `string`, `number`, `boolean`, `undefined`, `null` primitives; 
   - `object`, `array` non-primitives. 
 - Schematize content with property definitions validators.  
   - `type`, `required`, `match`, `enum`, `range`, `length` and custom validators.  
 - Capture content and validation events for any any methods that modify content.  
   - `Object` Events: `assign`, `defineProperties`, `defineProperty`, `freeze`, and `seal`.  
   - `Array` Events: `concat`, `copyWithin`, `fill`, `pop`, `push`, `reverse`, `shift`, `splice`, and `unshift`.  
   - `Accessor` Events: `get`, `set`, `delete`  

## Illustrations
