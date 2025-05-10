import { Model } from '/dependencies/objecture.js'
const array = new Model([])
array.addEvents({ 'pushElement': function($event) { console.log($event) } }, true)
array.push(0, 1, 2)