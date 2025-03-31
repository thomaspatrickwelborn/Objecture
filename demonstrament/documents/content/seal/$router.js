export default {
  active: true,
  name: 'Objecture | Content | Seal',
  path: '/content/seal',
  source: 'documents/content/seal',
  target: 'localhost/content/seal',
  middlewares: [
    ['static', ['static', {}]],
    ['static', ['localhost', {}]],
  ],
  methods: [],
  errors: [],
}