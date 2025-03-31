export default {
  active: true,
  name: 'Objecture | Content | Define Properties',
  path: '/content/define-properties',
  source: 'documents/content/define-properties',
  target: 'localhost/content/define-properties',
  middlewares: [
    ['static', ['static', {}]],
    ['static', ['localhost', {}]],
  ],
  methods: [],
  errors: [],
}