const express = require('express')
const Ajv = require('ajv')
const ajvFormats = require('ajv-formats')
const createError = require('http-errors')
const ObjectId = require('mongodb').ObjectId
const findUtils = require('../utils/find')
const asyncWrap = require('../utils/async-wrap')
const { send } = require('../utils/notifications')
const { getObjectI18n } = require('../utils/i18n')

const ajv = new Ajv()
ajvFormats(ajv)
const validate = ajv.compile(require('../../contract/message'))

const router = module.exports = express.Router()

router.get('', asyncWrap(async (req, res) => {
  if (!req.user) throw createError(401)
  const collection = req.app.get('db').collection('messages')
  const query = findUtils.query(req, { responseTo: 'responseTo._id' })
  const sort = findUtils.sort(req.query.sort || 'createdAt:-1', ['createdAt'])
  const project = findUtils.project(req.query.select)
  const [skip, size] = findUtils.pagination(req.query)
  const mongoQueries = [
    size > 0 ? collection.find(query).collation({ locale: 'en' }).limit(size).skip(skip).sort(sort).project(project).toArray() : Promise.resolve([]),
    collection.countDocuments(query)
  ]
  const [results, count] = await Promise.all(mongoQueries)
  const response = { count, results }
  res.json(response)
}))

router.post('', asyncWrap(async (req, res) => {
  if (!req.user) throw createError(401)
  const collection = req.app.get('db').collection('messages')
  const message = req.body
  delete message._id
  delete message.moderatedBy
  message.createdAt = new Date().toISOString()
  message.user = { id: req.user.id, name: req.user.name }
  message.owner = { type: req.user.activeAccount.type, id: req.user.activeAccount.id, name: req.user.activeAccount.name }
  if (!validate(message)) return res.status(400).send(validate.errors)
  const insertResponse = await collection.insertOne(message)
  message._id = insertResponse.insertedId.toString()

  if (req.user.activeAccount.type === 'organization' && req.body.responseTo?.user && req.body.responseTo.user.id !== req.user.id) {
    send({
      sender: { type: 'organization', id: req.user.activeAccount.id },
      topic: { key: 'social::message-posted' },
      title: getObjectI18n(req, 'notifications.message', {
        userName: req.body.responseTo.user.name,
        content: req.body.content
      }),
      recipient: { id: req.body.responseTo.user.id },
      outputs: []
    }).catch(console.error)
  }

  res.send(message)
}))

router.put('/:id/content', asyncWrap(async (req, res) => {
  if (!req.user) throw createError(401)
  const collection = req.app.get('db').collection('messages')
  const message = (await collection.findOneAndUpdate(
    { _id: new ObjectId(req.params.id), 'user.id': req.user.id },
    {
      $set: {
        content: req.body,
        editedAt: new Date().toISOString()
      }
    },
    { returnDocument: 'after' }
  )).value
  if (!message) return res.status(404).send()
  res.send(message)
}))

router.delete('/:id/content', asyncWrap(async (req, res) => {
  if (!req.user) throw createError(401)
  const collection = req.app.get('db').collection('messages')

  const filter = { _id: new ObjectId(req.params.id) }
  if (req.user.activeAccount?.role === 'admin') filter['owner.id'] = req.user.activeAccount.id
  else filter['user.id'] = req.user.id

  const message = await collection.findOne(filter)
  if (!message) return res.status(404).send()

  const toSet = {
    content: '',
    deletedAt: new Date().toISOString()
  }

  // Moderation : only admin can delete message from other users, if it's not his own message
  if (message.user && message.user.id !== req.user.id && req.user.activeAccount?.role === 'admin') {
    toSet.moderatedBy = {
      id: req.user.id,
      name: req.user.name
    }
  }

  const newMessage = (await collection.findOneAndUpdate(filter, { $set: toSet }, { returnDocument: 'after' })).value
  res.send(newMessage)
}))
