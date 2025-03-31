export default {
  active: true,
  name: 'Object | Content | Copy Within',
  path: '/content/copy-within',
  source: 'documents/content/copy-within',
  target: 'localhost/content/copy-within',
  middlewares: [
    ['static', ['static', {}]],
    ['static', ['localhost', {}]],
  ],
  methods: [],
  errors: [],
}