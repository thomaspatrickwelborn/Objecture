export default {
  active: true,
  name: 'Index',
  path: '/',
  source: 'documents',
  target: 'localhost',
  middlewares: [
    ['static', ['static', {}]],
    ['static', ['localhost', {}]],
  ],
  methods: [],
  errors: [],
}