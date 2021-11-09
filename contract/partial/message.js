const user = require('./user')

module.exports = {
  type: 'object',
  title: 'Comment reference',
  additionalProperties: false,
  required: ['_id', 'user', 'createdAt'],
  readOnly: true,
  properties: {
    _id: {
      type: 'string',
      title: 'Identifiant',
      readOnly: true
    },
    user,
    createdAt: {
      title: 'Date',
      type: 'string',
      format: 'date-time'
    }
  }
}
