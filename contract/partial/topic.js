module.exports = {
  type: 'object',
  additionalProperties: false,
  required: ['key', 'title'],
  properties: {
    key: {
      type: 'string',
      title: 'Key'
    },
    title: {
      oneOf: [{
        type: 'string',
        title: 'Label'
      }, {
        type: 'object',
        title: 'Internationalized label',
        patternProperties: { '.*': { type: 'string' } }
      }]
    }
  }
}
