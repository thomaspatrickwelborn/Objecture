export default {
  active: true,
  name: 'Objecture | Content | Reverse',
  path: '/content/reverse',
  source: 'documents/content/reverse',
  target: 'localhost/content/reverse',
  middlewares: [
    ['static', ['static', {}]],
    ['static', ['localhost', {}]],
  ],
  methods: [],
  errors: [],
}