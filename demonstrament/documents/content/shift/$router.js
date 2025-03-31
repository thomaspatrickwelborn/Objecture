export default {
  active: true,
  name: 'Objecture | Content | Shift',
  path: '/content/shift',
  source: 'documents/content/shift',
  target: 'localhost/content/shift',
  middlewares: [
    ['static', ['static', {}]],
    ['static', ['localhost', {}]],
  ],
  methods: [],
  errors: [],
}