# Accessor Traps
**MVC Framework \| Class System \| Model \| Content \| Handler \| Traps \| *Accessor***  
**Content**  
 - [Accessor Handler Trap Options]()
   - [`set` Options]()
   - [`get` Options]()
   - [`delete` Options]()
 - [Accessor Handler Trap Methods]()
   - [`set` Method]()
   - [`get` Method]()
   - [`delete` Method]()
 - [Accessor Handler Trap Events]()

## Accessor Handler Trap Options
Accessor Handler Trap Options are defined with new `Content` Instance creation.  
**Defaults**:  
```
const accessorOptions = {
  pathkey: true,
  subpathError: false,
  methods: {
    accessor: {
      get: {
        pathkey: true,
        subpathError: false,
        events: {
          'get': true,
          'getProperty': true,
        },
      },
      set: {
        pathkey: true,
        subpathError: false,
        recursive: true,
        events: {
          'set': true,
          'setProperty': true,
        },
      },
      delete: {
        pathkey: true,
        subpathError: false,
        events: {
          'delete': true,
          'deleteProperty': true,
        },
      },
    }
  }
}
```
### `get`, `set`, `delete` Shared Options
 - Shared Accessor Options may be set as `content` options or overriden as `content.methods.accessor.get`, `content.methods.accessor.set`, and `content.methods.accessor.delete`.  
**All Accessor Methods**:  
```
const object = new Content({}, null, {
  pathkey: false,
  subpathError: false,
})
```
**Individual Accessor Methods**:  
```
const object = new Content({}, null, {
  methods: { accessor: {
    get: { pathkey: false, subpathError: false },
    set: { pathkey: false, subpathError: false },
    delete: { pathkey: false, subpathError: false },
  } }
})
```
#### `pathkey` Option
**Type**: `Boolean`  
**Default**: `true`  
**Descript**:  
 - When `true`, properties accessed through dot-notation path.  
 - When `false`, properties accessed through key. 
##### `pathkey`: `true`
```
const object = new Content({
  propertyA: {
    propertyB: {
      propertyC: "CCC"
    }
  }
}, null, { pathkey: true })
console.log(
  object.get("propertyA.propertyB.propertyC")
)
// LOG: "CCC"
```
##### `pathkey`: `false`
Path accessor notation disabled, returns `undefined`.  
```
const object = new Content({
  propertyA: {
    propertyB: {
      propertyC: "CCC"
    }
  }
}, null, { pathkey: false })
console.log(
  object.get("propertyA.propertyB.propertyC")
)
// LOG: undefined
```
##### `pathkey` Escape
Quotation enclosures escape path accessor notation.  
```
const object = new Content({
  "propertyA.propertyB.propertyC": 333,
  propertyA: {
    propertyB: {
      propertyC: "CCC"
    }
  }
}, null, { pathkey: true })
console.log(
  object.get("\"propertyA.propertyB.propertyC\"")
)
// LOG: 333
console.log(
  object.get("propertyA.propertyB.propertyC")
)
// LOG: "CCC"
```
#### `subpathError` Option
**Type**: `Boolean`  
**Default**: `false`  
**Descript**:  
 - When `true` and `pathkey` is `true`, throws error when no subpath exists.  
 - When `false` and `pathkey` is `true`, returns `undefined` when no subpath exists.  
##### `subpathError`: `true`  
```
const object = new Content({
  propertyA: {}
})
console.log(
  object.get("propertyA.propertyB.propertyC")
)
// LOG: Uncaught TypeError: Cannot read properties of undefined
```
##### `subpathError`: `false`  
```
const object = new Content({
  propertyA: {}
})
console.log(
  object.get("propertyA.propertyB.propertyC")
)
// LOG: undefined
```

### `get` Options
```
{
  pathkey: true,
  subpathError: false,
  events: {
    'get': true,
    'getProperty': true,
  },
}
```
#### `get.events` Option
```
{
  events: {
    'get': true,
    'getProperty': true,
  }
}
```
**Type**: `Object`  
**Descript**:  
There are two types of events:  `get` and `getProperty`.  
 - `true`: enables event dispatch.  
 - `false`: disables event dispatch.  

### `set` Options
```
{
  pathkey: true,
  subpathError: false,
  recursive: true,
  events: {
    'set': true,
    'setProperty': true,
  },
}
```
#### `set.recursive` Option
```
{
  recursive: true
}
```
**Type**: `Boolean`  
**Default**: `true`  
**Descript**:  
 - `true`: When `pathkey` is `true` and subpath is `undefined`, create new Content Instances with `Array` or `Object` Literal then assign to subpath.  
 - `false`: When `pathkey` is `true` and subpath is `undefined`, throws error when no subpath exists.   
`TypeError: Cannot read properties of undefined`  
##### `set.recursive`: `true`
```
const object = new Content({}, null, {
  pathkey: true,
  subpathError: true,
  methods: { accessor: { set: { recursive: true } } },
})
console.log(
  object.set("propertyZ.propertyY", "YYY")
)
// LOG: Uncaught TypeError: Cannot read properties of undefined
```
##### `set.recursive`: `false`
```
const object = new Content({}, null, {
  pathkey: true,
  subpathError: true,
  methods: { accessor: { set: { recursive: false } } },
})
console.log(
  object.set("propertyZ.propertyY", "YYY")
)
// LOG: Uncaught TypeError: Cannot read properties of undefined
```
#### `set.events` Option
```
{
  events: {
    'set': true,
    'setProperty': true,
  }
}
```
**Type**: `Object`  
**Descript**:  
There are two types of events:  `set` and `setProperty`.  
 - `true`: enables event dispatch.  
 - `false`: disables event dispatch.  

### `delete` Options
```
{
  pathkey: true,
  subpathError: false,
  events: {
    'delete': true,
    'deleteProperty': true,
  },
}
```
#### `delete.events` Option
```
{
  events: {
    'delete': true,
    'deleteProperty': true,
  }
}
```
**Type**: `Object`  
**Descript**:  
There are two types of events:  `delete` and `deleteProperty`.  
 - `true`: enables event dispatch.  
 - `false`: disables event dispatch.  

## Accessor Handler Trap Methods
### `get` Method
Accepts zero, one, or two arguments:  
```
get()
get($contentOptions)
get($propertyPath)
get($propertyPath, $contentOptions)
```
#### `get` Arguments
##### `$propertyPath` Argument
**Type**: `String` Literal
**Descript**:  
 - Dot-notation path to property, or property key.  


### `set` Method
Accepts one, two, or three arguments:  
```
set($propertyTree)
set($propertyTree, $contentOptions)
set($propertyPath, $propertyValue)
set($propertyPath, $propertyValue, $contentOptions)
```
#### `set` Arguments
##### `$propertyTree` Argument
**Type**: `Object` Literal, `Array` Literal, `Content` Instance
**Descript**: 
##### `$propertyPath` Argument
**Type**: `String` Literal
**Descript**:  
Dot-notation path to property, or property key.  
##### `$propertyValue` Argument
**Type**: `Mixed`  
**Descript**:  
Property value assigned to `$propertyPath`.  


### `delete` Method
Accepts zero, one, or two arguments:  
```
delete()
delete($contentOptions)
delete($propertyPath)
delete($propertyPath, $contentOptions)
```
 - **Zero Arguments**: Deletes all properties from `content`.  
 - **One Argument**: Deletes property value at `$propertyPath`.  
#### `delete` Arguments
##### `$propertyPath` Argument
**Type**: `String` Literal  
**Descript**:  
Dot-notation path to property, or property key.  
