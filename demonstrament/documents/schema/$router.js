export default {
  active: true,
  name: 'Objecture | Model',
  path: '/schema',
  source: 'documents/schema',
  target: 'localhost/schema',
  middlewares: [
    ['static', ['static', {}]],
    ['static', ['localhost', {}]],
  ],
  methods: [],
  errors: [],
}