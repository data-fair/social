const config = require('config')
const moment = require('moment')
const rp = require('request-promise-native')
const fs = require('fs-extra')
const asyncWrap = require('../utils/async-wrap')

async function mongoStatus (req) {
  await req.app.get('db').admin().serverStatus()
}

async function nuxtStatus (req) {
  if (process.env.NODE_ENV === 'test') return
  const nuxtConfig = require('../../nuxt.config.js')
  const dir = nuxtConfig.buildDir || '.nuxt'
  await fs.writeFile(`${dir}/check-access.txt`, 'ok')
  if (req.app.get('nuxt')) await req.app.get('nuxt').renderRoute('/')
}

async function singleStatus (req, fn, name) {
  const time = moment()
  try {
    await fn(req)
    return { status: 'ok', name, timeInMs: moment().diff(time) }
  } catch (err) {
    return { status: 'error', message: err.toString(), name, timeInMs: moment().diff(time) }
  }
}

async function getStatus (req) {
  const results = await Promise.all([
    singleStatus(req, mongoStatus, 'mongodb'),
    singleStatus(req, nuxtStatus, 'nuxt')
  ])
  const errors = results.filter(r => r.status === 'error')
  return {
    status: errors.length ? 'error' : 'ok',
    message: errors.length ? ('Problem with : ' + errors.map(s => s.name).join(', ')) : 'Service is ok',
    details: results
  }
}

exports.status = asyncWrap(async (req, res, next) => {
  const status = await getStatus(req)
  res.send(status)
})

exports.ping = asyncWrap(async (req, res, next) => {
  const status = await getStatus(req)
  if (status.status === 'error') res.status(500).send(status)
  else res.send(status.status)
})
