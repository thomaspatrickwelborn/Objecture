export default {
  active: true,
  name: 'Objecture | Model',
  path: '/model',
  source: 'documents/model',
  target: 'localhost/model',
  middlewares: [
    ['static', ['static', {}]],
    ['static', ['localhost', {}]],
  ],
  methods: [],
  errors: [],
}