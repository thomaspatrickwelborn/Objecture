export default {
  active: true,
  name: 'Objecture | Content | Splice',
  path: '/content/splice',
  source: 'documents/content/splice',
  target: 'localhost/content/splice',
  middlewares: [
    ['static', ['static', {}]],
    ['static', ['localhost', {}]],
  ],
  methods: [],
  errors: [],
}