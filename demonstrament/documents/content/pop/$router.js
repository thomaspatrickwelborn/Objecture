export default {
  active: true,
  name: 'Objecture | Content | Pop',
  path: '/content/pop',
  source: 'documents/content/pop',
  target: 'localhost/content/pop',
  middlewares: [
    ['static', ['static', {}]],
    ['static', ['localhost', {}]],
  ],
  methods: [],
  errors: [],
}