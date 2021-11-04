const express = require('express')
const Ajv = require('ajv')
const ajvFormats = require('ajv-formats')
const createError = require('http-errors')
const ObjectID = require('mongodb').ObjectID
const findUtils = require('../utils/find')
const asyncWrap = require('../utils/async-wrap')

const ajv = new Ajv()
ajvFormats(ajv)
const validate = ajv.compile(require('../../contract/rating'))

const router = module.exports = express.Router()

router.get('', asyncWrap(async (req, res) => {
  if (!req.user) throw createError(401)
  const collection = req.app.get('db').collection('ratings')
  const query = findUtils.query(req)
  const sort = findUtils.sort(req.query.sort)
  const project = findUtils.project(req.query.select)
  const [skip, size] = findUtils.pagination(req.query)
  const mongoQueries = [
    size > 0 ? collection.find(query).collation({ locale: 'en' }).limit(size).skip(skip).sort(sort).project(project).toArray() : Promise.resolve([]),
    collection.countDocuments(query)
  ]
  const [results, count] = await Promise.all(mongoQueries)
  res.json({ count, results })
}))

router.post('', asyncWrap(async (req, res) => {
  if (!req.user) throw createError(401)
  const collection = req.app.get('db').collection('ratings')
  const rating = req.body
  rating.createdAt = new Date().toISOString()
  rating.user = { id: req.user.id, name: req.user.name }
  rating.owner = { type: req.user.activeAccount.type, id: req.user.activeAccount.id, name: req.user.activeAccount.name }
  if (!validate(rating)) return res.status(400).send(validate.errors)
  const replaceResponse = await collection.findOneAndReplace(
    { 'owner.type': rating.owner.type, 'owner.id': rating.owner.id, 'topic.key': rating.topic.key, 'user.id': rating.user.id },
    rating, { upsert: true })
  if (replaceResponse.value) {
    rating.id = replaceResponse.value._id.toString()
  } else {
    rating._id = replaceResponse.lastErrorObject.upserted.toString()
  }
  res.send(rating)
}))

router.delete('/:id', asyncWrap(async (req, res) => {
  if (!req.user) throw createError(401)
  const collection = req.app.get('db').collection('ratings')
  await collection.deleteOne({ 'user.id': req.user.id, _id: ObjectID(req.params.id) })
  res.status(204).send()
}))
