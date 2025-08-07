import { Recourse } from '/dependencies/recourse.js'
const object = {
  propertyA: [
    { propertyC: 3 },
    { propertyC: 33 },
    { propertyC: 333 },
  ]
}
const objectAST = Recourse.expand(object, ($value) => {
  return { source: { value: $value } }
})
console.log("-----------------------")
console.log("Expand Tree | Example 6")
console.log("-----------------------")
const objectString = JSON.stringify(object, null, 2)
const objectASTString = JSON.stringify(objectAST, null, 2)
console.log("object", objectString)
console.log("objectAST", objectASTString)
console.log("pass", `{
  "propertyA": {
    "source": {
      "value": [
        {
          "source": {
            "value": {
              "propertyC": {
                "source": {
                  "value": 3
                }
              }
            }
          }
        },
        {
          "source": {
            "value": {
              "propertyC": {
                "source": {
                  "value": 33
                }
              }
            }
          }
        },
        {
          "source": {
            "value": {
              "propertyC": {
                "source": {
                  "value": 333
                }
              }
            }
          }
        }
      ]
    }
  }
}` === objectASTString)