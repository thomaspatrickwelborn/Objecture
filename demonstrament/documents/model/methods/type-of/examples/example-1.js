import { typeOf } from '/dependencies/recourse.js'
console.log("-------------------")
console.log("Type Of | Example 1")
console.log("-------------------")

const typesOf = [
  [`typeOf(new Object()) === ${typeOf(new Object())}`, typeOf(new Object()) === 'object'],
  [`typeOf(new Array()) === ${typeOf(new Array())}`, typeOf(new Array()) === 'array'],
  [`typeOf(new Map()) === ${typeOf(new Map())}`, typeOf(new Map()) === 'map'],
  [`typeOf(new Set()) === ${typeOf(new Set())}`, typeOf(new Set()) === 'set'],
  [`typeOf(new Date()) === ${typeOf(new Date())}`, typeOf(new Date()) === 'date'],
  [`typeOf(new RegExp()) === ${typeOf(new RegExp())}`, typeOf(new RegExp()) === 'regexp'],
  [`typeOf(new Promise(() => {})) === ${typeOf(new Promise(() => {}))}`, typeOf(new Promise(() => {})) === 'promise'],
  [`typeOf(new ArrayBuffer()) === ${typeOf(new ArrayBuffer())}`, typeOf(new ArrayBuffer()) === 'arraybuffer'],
  [`typeOf(new Function()) === ${typeOf(new Function())}`, typeOf(new Function()) === 'function'],
  [`typeOf(Number()) === ${typeOf(Number())}`, typeOf(Number()) === 'number'],
  [`typeOf(String()) === ${typeOf(String())}`, typeOf(String()) === 'string'],
  [`typeOf(Number()) === ${typeOf(Number())}`, typeOf(Number()) === 'number'],
  [`typeOf(BigInt(100000000000000000000000000000000)) === ${typeOf(BigInt(100000000000000000000000000000000))}`, typeOf(BigInt(100000000000000000000000000000000)) === 'bigint'],
  [`typeOf(null) === ${typeOf(null)}`, typeOf(null) === 'null'],
  [`typeOf(undefined) === ${typeOf(undefined)}`, typeOf(undefined) === 'undefined'],
]
console.log("typesOf", JSON.stringify(typesOf, null, 2))
const typesOfValidation = [
  typeOf(new Object()) === 'object', 
  typeOf(new Array()) === 'array', 
  typeOf(new Map()) === 'map', 
  typeOf(new Set()) === 'set', 
  typeOf(new Date()) === 'date', 
  typeOf(new RegExp()) === 'regexp', 
  typeOf(new Promise(() => {})) === 'promise', 
  typeOf(new ArrayBuffer()) === 'arraybuffer', 
  typeOf(new Function()) === 'function', 
  typeOf(Number()) === 'number', 
  typeOf(String()) === 'string', 
  typeOf(Number()) === 'number', 
  typeOf(BigInt(100000000000000000000000000000000)) === 'bigint', 
  typeOf(null) === 'null', 
  typeOf(undefined) === 'undefined', 
]
console.log("pass", typesOfValidation.every(($value) => $value))