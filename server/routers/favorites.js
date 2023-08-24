const express = require('express')
const Ajv = require('ajv')
const ajvFormats = require('ajv-formats')
const createError = require('http-errors')
const ObjectId = require('mongodb').ObjectId
const findUtils = require('../utils/find')
const asyncWrap = require('../utils/async-wrap')

const ajv = new Ajv()
ajvFormats(ajv)
const validate = ajv.compile(require('../../contract/favorite'))

const router = module.exports = express.Router()

router.get('', asyncWrap(async (req, res) => {
  if (!req.user) throw createError(401)
  const collection = req.app.get('db').collection('favorites')

  // favorites cannot be queries as ratings and messages
  req.query.user = req.user.id

  const query = findUtils.query(req)
  const sort = findUtils.sort(req.query.sort, ['createdAt'])
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
  const collection = req.app.get('db').collection('favorites')
  const favorite = req.body
  delete favorite._id
  favorite.createdAt = new Date().toISOString()
  favorite.user = { id: req.user.id, name: req.user.name }
  favorite.owner = { type: req.user.activeAccount.type, id: req.user.activeAccount.id, name: req.user.activeAccount.name }
  if (!validate(favorite)) return res.status(400).send(validate.errors)
  const replaceResponse = await collection.findOneAndReplace(
    { 'owner.type': favorite.owner.type, 'owner.id': favorite.owner.id, 'topic.key': favorite.topic.key, 'user.id': favorite.user.id },
    favorite, { upsert: true })
  if (replaceResponse.value) {
    favorite._id = replaceResponse.value._id.toString()
  } else {
    favorite._id = replaceResponse.lastErrorObject.upserted.toString()
  }
  res.send(favorite)
}))

router.delete('/:id', asyncWrap(async (req, res) => {
  if (!req.user) throw createError(401)
  const collection = req.app.get('db').collection('favorites')
  await collection.deleteOne({ 'user.id': req.user.id, _id: new ObjectId(req.params.id) })
  res.status(204).send()
}))
