export default {
  active: false,
  name: 'Objecture | Content | Fill',
  path: '/content/fill',
  source: 'documents/content/fill',
  target: 'localhost/content/fill',
  middlewares: [
    ['static', ['static', {}]],
    ['static', ['localhost', {}]],
  ],
  methods: [],
  errors: [],
}