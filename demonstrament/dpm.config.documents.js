import { readFile } from 'node:fs/promises'
import certificates from './certificates.js'
export default {
  name: "Objecture | Demonstrament",
  inspector: {
    port: 9245,
    host: "127.0.0.1",
  },
  server: {
    https: {
      key: await readFile(certificates.key.path),
      cert: await readFile(certificates.cert.path),
      port: 3348,
      host: "demonstrament.objecture",
    },
  },
  browserSync: {
    logPrefix: "Objecture | Demonstrament",
    port: 3349,
    open: false,
    ui: false, 
    ghostMode: false,
    host: "demonstrament.objecture",
    https: {
      key: certificates.key.path,
      cert: certificates.cert.path,
    },
    files: [
      'static/**/*.*', 'localhost/**/*.*',
    ],
    proxy: {
      ws: true,
    },
    // reloadDelay: 1000,
    // reloadDebounce: 1000,
    // reloadThrottle: 1000,
    injectChanges: true,
  },
  sockets: {
    host: "demonstrament.objecture",
    config: '$socket.js',
    source: 'documents',
    target: 'localhost',
  },
  routers: {
    config: '$router.js',
    source: 'documents',
    target: 'localhost',
  },
  documents: {
    config: '$document.js',
    source: 'documents',
    target: 'localhost',
  },
}