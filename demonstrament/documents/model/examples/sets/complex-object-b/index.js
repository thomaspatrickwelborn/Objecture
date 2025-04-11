export default { 
  propertyA: { enumerable: true, writable: true, value: 111 },
  propertyB: { enumerable: true, writable: true, value: [{ enumerable: true, writable: true, value: {
    propertyC: { enumerable: true, writable: true, value: 333 },
    propertyD: { enumerable: true, writable: true, value: {
      propertyE: { enumerable: true, writable: true, value: 555 }
    } } },
  }] }, 
  propertyF: { enumerable: true, writable: true, value: {
    propertyG: { enumerable: true, writable: true, value: 777 }
  } }
}