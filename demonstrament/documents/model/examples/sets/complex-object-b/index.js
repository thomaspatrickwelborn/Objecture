export default {
  propertyA: { writable: true, configurable: true, enumerable: true, value: {
    propertyB: { writable: true, configurable: true, enumerable: true, value: {
      propertyC: { writable: true, configurable: true, enumerable: true, value: 333 },
      propertyH: { writable: true, configurable: true, enumerable: true, value: null },
    } },
  } },
  propertyD: { writable: true, configurable: true, enumerable: true, value: [
    { writable: true, configurable: true, enumerable: true, value: [{ writable: true, configurable: true, enumerable: true, value: {
      propertyE: { writable: true, configurable: true, enumerable: true, value: 555 },
      propertyI: { writable: true, configurable: true, enumerable: true, value: false },
    } }, { writable: true, configurable: true, enumerable: true, value: {
      propertyF: { writable: true, configurable: true, enumerable: true, value: {
        propertyG: { writable: true, configurable: true, enumerable: true, value: 777 },
        propertyJ: { writable: true, configurable: true, enumerable: true, value: true },
      } },
    } }] },
    { writable: true, configurable: true, enumerable: true, value: [{ writable: true, configurable: true, enumerable: true, value: {
      propertyE: { writable: true, configurable: true, enumerable: true, value: -555 },
      propertyK: { writable: true, configurable: true, enumerable: true, value: "555" },
    } }, { writable: true, configurable: true, enumerable: true, value: {
      propertyF: { writable: true, configurable: true, enumerable: true, value: {
        propertyG: { writable: true, configurable: true, enumerable: true, value: -777 },
        propertyL: { writable: true, configurable: true, enumerable: true, value: "777" ,
      } } }
    } }] },
  ] },
  propertyM: { value: BigInt("0b11111111111111111111111111111111111111111111111111111") },
}