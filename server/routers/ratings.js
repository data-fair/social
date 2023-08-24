const express = require('express')
const Ajv = require('ajv')
const ajvFormats = require('ajv-formats')
const createError = require('http-errors')
const ObjectId = require('mongodb').ObjectId
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
  const sort = findUtils.sort(req.query.sort || 'createdAt:-1', ['createdAt'])
  const project = findUtils.project(req.query.select)
  const [skip, size] = findUtils.pagination(req.query)
  const mongoQueries = [
    size > 0 ? collection.find(query).collation({ locale: 'en' }).limit(size).skip(skip).sort(sort).project(project).toArray() : Promise.resolve([]),
    collection.countDocuments(query),
    req.query.facet ? collection.aggregate([{ $match: query }, { $facet: findUtils.facetQuery(req.query.facet, ['score']) }]).toArray() : Promise.resolve(undefined)
  ]
  const [results, count, facetsAgg] = await Promise.all(mongoQueries)
  const response = { count, results }
  if (facetsAgg) response.facets = findUtils.facetResponse(facetsAgg)
  res.json(response)
}))

router.post('', asyncWrap(async (req, res) => {
  if (!req.user) throw createError(401)
  const collection = req.app.get('db').collection('ratings')
  const rating = req.body
  delete rating._id
  rating.createdAt = new Date().toISOString()
  rating.user = { id: req.user.id, name: req.user.name }
  rating.owner = { type: req.user.activeAccount.type, id: req.user.activeAccount.id, name: req.user.activeAccount.name }
  if (!validate(rating)) return res.status(400).send(validate.errors)
  const replaceResponse = await collection.findOneAndReplace(
    { 'owner.type': rating.owner.type, 'owner.id': rating.owner.id, 'topic.key': rating.topic.key, 'user.id': rating.user.id },
    rating, { upsert: true })
  if (replaceResponse.value) {
    rating._id = replaceResponse.value._id.toString()
  } else {
    rating._id = replaceResponse.lastErrorObject.upserted.toString()
  }
  res.send(rating)
}))

router.delete('/:id', asyncWrap(async (req, res) => {
  if (!req.user) throw createError(401)
  const collection = req.app.get('db').collection('ratings')
  await collection.deleteOne({ 'user.id': req.user.id, _id: new ObjectId(req.params.id) })
  res.status(204).send()
}))
