# Accessor Traps
**MVC Framework \| Class System \| Model \| Model \| Handler \| Traps \| *Accessor***  
**Model**  
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
Accessor Handler Trap Options are defined with new `Model` Instance creation.  
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
 - Shared Accessor Options may be set as `model` options or overriden as `model.methods.accessor.get`, `model.methods.accessor.set`, and `model.methods.accessor.delete`.  
**All Accessor Methods**:  
```
const object = new Model({}, null, {
  pathkey: false,
  subpathError: false,
})
```
**Individual Accessor Methods**:  
```
const object = new Model({}, null, {
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
const object = new Model({
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
const object = new Model({
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
const object = new Model({
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
const object = new Model({
  propertyA: {}
})
console.log(
  object.get("propertyA.propertyB.propertyC")
)
// LOG: Uncaught TypeError: Cannot read properties of undefined
```
##### `subpathError`: `false`  
```
const object = new Model({
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
 - `true`: When `pathkey` is `true` and subpath is `undefined`, create new Model Instances with `Array` or `Object` Literal then assign to subpath.  
 - `false`: When `pathkey` is `true` and subpath is `undefined`, throws error when no subpath exists.   
`TypeError: Cannot read properties of undefined`  
##### `set.recursive`: `true`
```
const object = new Model({}, null, {
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
const object = new Model({}, null, {
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
get($modelOptions)
get($propertyPath)
get($propertyPath, $modelOptions)
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
set($propertyTree, $modelOptions)
set($propertyPath, $propertyValue)
set($propertyPath, $propertyValue, $modelOptions)
```
#### `set` Arguments
##### `$propertyTree` Argument
**Type**: `Object` Literal, `Array` Literal, `Model` Instance
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
delete($modelOptions)
delete($propertyPath)
delete($propertyPath, $modelOptions)
```
 - **Zero Arguments**: Deletes all properties from `model`.  
 - **One Argument**: Deletes property value at `$propertyPath`.  
#### `delete` Arguments
##### `$propertyPath` Argument
**Type**: `String` Literal  
**Descript**:  
Dot-notation path to property, or property key.  
