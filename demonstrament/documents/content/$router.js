export default {
  active: true,
  name: 'Objecture | Content',
  path: '/content',
  source: 'documents/content',
  target: 'localhost/content',
  middlewares: [
    ['static', ['static', {}]],
    ['static', ['localhost', {}]],
  ],
  methods: [],
  errors: [],
}