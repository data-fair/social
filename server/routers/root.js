const express = require('express')
const status = require('../routers/status')

const router = express.Router()

router.get('/status', status.status)
router.get('/ping', status.ping)

module.exports = router
