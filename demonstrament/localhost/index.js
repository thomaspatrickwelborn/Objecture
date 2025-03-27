import { Content } from '/dependencies/objecture.js';

function eventLog($event) { console.log($event.type); }
const object = new Content({}, null);
object.addEvents({
  'assign': eventLog,
  'propertyA.propertyB.propertyC assign': eventLog,
  'propertyE.[0-9] assign': eventLog,
}).enableEvents();
// object.addEventListener('assign', eventLog)
object.assign({
  propertyA: { propertyB: { propertyC: { propertyD: true } } },
  propertyE: [
    { propertyF: false }, { propertyF: false }, { propertyF: false }
  ]
});
object.assign({
  propertyA: { propertyB: { propertyC: { propertyD: true } } },
  propertyE: [
    { propertyF: false }, { propertyF: false }, { propertyF: false }
  ],
});
//# sourceMappingURL=index.js.map
