import { stringifyBuffer } from './coutil/index.js'
export default {
  active: false,
  name: 'Index',
  protocol: "wss:",
  port: 3348,
  host: "demonstrament.objecture",
  path: '/',
  source: 'documents',
  target: 'localhost',
  open: function open() {},
  close: function close() {},
  error: function error() {},
  messageAdapters: [
    {
      name: 'RESTAdapter',
      message: function message($data, $isBinary) {
        try {
          const [$type/*, $model */] = [].concat(stringifyBuffer($data))
          return this.messages[$type]
        }
        catch($err) { console.log($err) }
      },
      messages: {
        'get': function getMessage($webSocket, $data, $isBinary) {
          const [$type] = [].concat(stringifyBuffer($data))
          const model = { propertyA: "propertyA" }
          const messageString = JSON.stringify(['get', model])
          console.log(this)
          $webSocket.send(messageString)
          return { type: $type, detail: model }
        },
        'post': function postMessage($webSocket, $data, $isBinary) {
          console.log('post', JSON.stringify(data.toString()))
        },
        'delete': function deleteMessage($webSocket, $data, $isBinary) {
          console.log('delete', JSON.stringify(data.toString()))
        },
      },
    }
  ],
}