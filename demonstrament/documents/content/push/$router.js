export default {
  active: true,
  name: 'Objecture | Content | Push',
  path: '/content/push',
  source: 'documents/content/push',
  target: 'localhost/content/push',
  middlewares: [
    ['static', ['static', {}]],
    ['static', ['localhost', {}]],
  ],
  methods: [],
  errors: [],
}