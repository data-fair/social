const topic = require('./partial/topic')
const user = require('./partial/user')
const owner = require('./partial/owner')

module.exports = {
  type: 'object',
  title: 'Favorite',
  additionalProperties: false,
  required: ['owner', 'topic', 'user', 'createdAt'],
  readOnly: true,
  properties: {
    _id: {
      type: 'string',
      title: 'Identifiant',
      readOnly: true
    },
    owner,
    topic,
    user,
    createdAt: {
      title: 'Date',
      type: 'string',
      format: 'date-time'
    }
  }
}
