export default {
  active: true,
  name: 'Objecture | Content | Get',
  path: '/content/delete',
  source: 'documents/content/delete',
  target: 'localhost/content/delete',
  middlewares: [
    ['static', ['static', {}]],
    ['static', ['localhost', {}]],
  ],
  methods: [],
  errors: [],
}