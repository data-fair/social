const express = require('express')
const Ajv = require('ajv')
const ajvFormats = require('ajv-formats')
const createError = require('http-errors')
const ObjectId = require('mongodb').ObjectId
// const config = require('config')
const findUtils = require('../utils/find')
const asyncWrap = require('../utils/async-wrap')

const ajv = new Ajv()
ajvFormats(ajv)
const validate = ajv.compile(require('../../contract/note'))

const router = module.exports = express.Router()

/* const cantEdit = (req) => {
  return req.user.activeAccount.type !== 'user' && req.user.organization && config.allowedEditRoles && !config.allowedEditRoles.includes(req.user.activeAccount.role)
} */

router.get('', asyncWrap(async (req, res) => {
  if (!req.user) throw createError(401)
  const collection = req.app.get('db').collection('notes')
  const query = findUtils.query(req, { responseTo: 'responseTo._id' })
  const sort = findUtils.sort(req.query.sort || 'createdAt:1', ['createdAt'])
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
  // if (cantEdit(req)) throw createError(403)
  const collection = req.app.get('db').collection('notes')
  const note = req.body
  delete note._id
  note.createdAt = new Date().toISOString()
  note.user = { id: req.user.id, name: req.user.name }
  note.owner = { type: req.user.activeAccount.type, id: req.user.activeAccount.id, name: req.user.activeAccount.name }
  if (!validate(note)) return res.status(400).send(validate.errors)
  const insertResponse = await collection.insertOne(note)
  note._id = insertResponse.insertedId.toString()
  res.send(note)
}))

router.put('/:id/content', asyncWrap(async (req, res) => {
  if (!req.user) throw createError(401)
  // if (cantEdit(req)) throw createError(403)
  const collection = req.app.get('db').collection('notes')
  const note = (await collection.findOneAndUpdate(
    { _id: new ObjectId(req.params.id), 'owner.id': req.user.activeAccount.id },
    {
      $set: {
        content: req.body,
        editedAt: new Date().toISOString(),
        user: { id: req.user.id, name: req.user.name }
      }
    },
    { returnDocument: 'after' }
  )).value
  if (!note) return res.status(404).send()
  res.send(note)
}))

router.delete('/:id', asyncWrap(async (req, res) => {
  if (!req.user) throw createError(401)
  // if (cantEdit(req)) throw createError(403)
  const collection = req.app.get('db').collection('notes')
  const note = await collection.findOneAndDelete(
    { _id: new ObjectId(req.params.id), 'owner.id': req.user.activeAccount.id }
  )
  if (!note) return res.status(404).send()
  res.send(req.params.id + ' deleted')
}))
