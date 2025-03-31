export default {
  active: true,
  name: 'Objecture | Content | Set',
  path: '/content/set',
  source: 'documents/content/set',
  target: 'localhost/content/set',
  middlewares: [
    ['static', ['static', {}]],
    ['static', ['localhost', {}]],
  ],
  methods: [],
  errors: [],
}