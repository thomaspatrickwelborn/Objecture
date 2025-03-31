export default {
  active: true,
  name: 'Objecture | Content | Get',
  path: '/content/get',
  source: 'documents/content/get',
  target: 'localhost/content/get',
  middlewares: [
    ['static', ['static', {}]],
    ['static', ['localhost', {}]],
  ],
  methods: [],
  errors: [],
}