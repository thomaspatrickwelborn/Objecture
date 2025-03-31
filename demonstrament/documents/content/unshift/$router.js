export default {
  active: true,
  name: 'Objecture | Content | Unshift',
  path: '/content/unshift',
  source: 'documents/content/unshift',
  target: 'localhost/content/unshift',
  middlewares: [
    ['static', ['static', {}]],
    ['static', ['localhost', {}]],
  ],
  methods: [],
  errors: [],
}