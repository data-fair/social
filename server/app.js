const config = require('config')
const express = require('express')
const eventToPromise = require('event-to-promise')
const originalUrl = require('original-url')
const { format: formatUrl } = require('url')
const dbUtils = require('./utils/db')
const wsUtils = require('./utils/ws')
const i18n = require('./utils/i18n')
const session = require('@koumoul/sd-express')({
  directoryUrl: config.directoryUrl,
  privateDirectoryUrl: config.privateDirectoryUrl || config.directoryUrl
})
const debugDomain = require('debug')('domain')

const app = express()

app.use((req, res, next) => {
  if (!req.app.get('api-ready')) res.status(503).send('Service indisponible pour cause de maintenance.')
  else next()
})

app.set('trust proxy', 1)
app.set('json spaces', 2)

if (process.env.NODE_ENV === 'development') {
  // Create a mono-domain environment with other services in dev
  const { createProxyMiddleware } = require('http-proxy-middleware')
  app.use('/openapi-viewer', createProxyMiddleware({ target: 'http://localhost:5680', pathRewrite: { '^/openapi-viewer': '' } }))
  app.use('/simple-directory', createProxyMiddleware({ target: 'http://localhost:8080', pathRewrite: { '^/simple-directory': '' } }))
  app.use('/notify', createProxyMiddleware({ target: 'http://localhost:8088', pathRewrite: { '^/notify': '' } }))
}

app.use(require('body-parser').json())
app.use(require('cookie-parser')())
app.use(i18n.middleware)
app.use(session.auth)

// set current baseUrl, i.e. the url of @data-fair/social on the current user's domain
let basePath = new URL(config.publicUrl).pathname
if (!basePath.endsWith('/')) basePath += '/'
app.use('/', (req, res, next) => {
  const u = originalUrl(req)
  const urlParts = { protocol: u.protocol, hostname: u.hostname, pathname: basePath.slice(0, -1) }
  if (u.port !== 443 && u.port !== 80) urlParts.port = u.port
  req.publicBaseUrl = u.full ? formatUrl(urlParts) : config.publicUrl
  req.directoryUrl = u.full ? formatUrl({ ...urlParts, pathname: '/simple-directory' }) : config.directoryUrl
  debugDomain('req.publicBaseUrl', req.publicBaseUrl)
  req.publicWsBaseUrl = req.publicBaseUrl.replace('http:', 'ws:').replace('https:', 'wss:') + '/'
  debugDomain('req.publicWsBaseUrl', req.publicWsBaseUrl)
  req.publicBasePath = basePath
  debugDomain('req.publicBasePath', req.publicBasePath)
  next()
})

// Business routers
app.use('/api/v1', require('./routers/root'))

// Error management
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).send('invalid token...')
  }
  const status = err.statusCode || err.status || 500
  if (status === 500) console.error('Error in express route', err)
  if (!res.headersSent) {
    res.set('Cache-Control', 'no-cache')
    res.set('Expires', '-1')
    res.status(status).send(err.message)
  } else {
    res.end()
  }
})

const WebSocket = require('ws')
const server = require('http').createServer(app)
const wss = new WebSocket.Server({ server })

// Run app and return it in a promise
exports.run = async () => {
  const { db, client } = await dbUtils.connect()
  await dbUtils.init(db)

  app.set('db', db)
  app.set('mongoClient', client)

  app.publish = await wsUtils.initPublisher(db)
  await wsUtils.initServer(wss, db, session)

  // At this stage the server is ready to respond to API requests
  app.set('api-ready', true)

  app.use((req, res, next) => {
    if (!req.app.get('ui-ready')) res.status(503).send('Service indisponible pour cause de maintenance.')
    else next()
  })

  const nuxt = await require('./nuxt')()
  app.set('nuxt', nuxt.instance)
  app.use(nuxt.render)
  app.set('ui-ready', true)

  server.listen(config.port)
  await eventToPromise(server, 'listening')

  return app
}

exports.stop = async () => {
  server.close()
  wss.close()
  wsUtils.stop()
  await app.get('mongoClient').close()
}
