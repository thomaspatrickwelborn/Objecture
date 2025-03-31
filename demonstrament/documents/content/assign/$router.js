export default {
  active: true,
  name: 'Objecture | Content | Assign',
  path: '/content/assign',
  source: 'documents/content/assign',
  target: 'localhost/content/assign',
  middlewares: [
    ['static', ['static', {}]],
    ['static', ['localhost', {}]],
  ],
  methods: [],
  errors: [],
}