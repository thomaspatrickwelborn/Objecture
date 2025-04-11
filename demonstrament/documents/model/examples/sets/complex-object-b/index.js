export default {
  propertyA: { value: {
    propertyB: { value: {
      propertyC: { value: 333 },
      propertyH: { value: null },
    } },
  } },
  propertyD: { value: [
    { value: [{ value: {
      propertyE: { value: 555 },
      propertyI: { value: false },
    } }, { value: {
      propertyF: { value: {
        propertyG: { value: 777 },
        propertyJ: { value: true },
      } },
    } }] },
    { value: [{ value: {
      propertyE: { value: -555 },
      propertyK: { value: "555" },
    } }, { value: {
      propertyF: { value: {
        propertyG: { value: -777 },
        propertyL: { value: "777" ,
      } } }
    } }] },
  ] },
  propertyM: { value: BigInt("0b11111111111111111111111111111111111111111111111111111") },
}