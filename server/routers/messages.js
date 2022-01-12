const express = require('express')
const Ajv = require('ajv')
const ajvFormats = require('ajv-formats')
const createError = require('http-errors')
const ObjectId = require('mongodb').ObjectId
const findUtils = require('../utils/find')
const asyncWrap = require('../utils/async-wrap')

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
  message.createdAt = new Date().toISOString()
  message.user = { id: req.user.id, name: req.user.name }
  message.owner = { type: req.user.activeAccount.type, id: req.user.activeAccount.id, name: req.user.activeAccount.name }
  if (!validate(message)) return res.status(400).send(validate.errors)
  const insertResponse = await collection.insertOne(message)
  message._id = insertResponse.insertedId.toString()
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

  const message = (await collection.findOneAndUpdate(
    filter,
    {
      $set: {
        content: '',
        deletedAt: new Date().toISOString()
      }
    },
    { returnDocument: 'after' }
  )).value
  if (!message) return res.status(404).send()
  res.send(message)
}))
