const topic = require('./partial/topic')
const user = require('./partial/user')
const owner = require('./partial/owner')

module.exports = {
  type: 'object',
  title: 'Rating',
  additionalProperties: false,
  required: ['owner', 'topic', 'user', 'score', 'createdAt'],
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
    score: {
      title: 'Score',
      type: 'integer',
      minimum: 1,
      maximum: 5
    },
    comment: {
      title: 'Comment',
      type: 'string',
      maxLength: 200
    },
    createdAt: {
      title: 'Date',
      type: 'string',
      format: 'date-time'
    }
  }
}
