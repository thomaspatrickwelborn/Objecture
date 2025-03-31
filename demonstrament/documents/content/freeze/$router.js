export default {
  active: true,
  name: 'Objecture | Content | Freeze',
  path: '/content/freeze',
  source: 'documents/content/freeze',
  target: 'localhost/content/freeze',
  middlewares: [
    ['static', ['static', {}]],
    ['static', ['localhost', {}]],
  ],
  methods: [],
  errors: [],
}