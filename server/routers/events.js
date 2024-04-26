/**
 * Events.js
 * Local event management with 'event' method used in 'common' module
 */

const express = require('express')
const { notifyList } = require('../../contract/localEvents')
const i18n = require('../utils/i18n')
const asyncWrap = require('../utils/async-wrap')

const router = module.exports = express.Router()

/**
 * Get the notification id
 * @param {string} serviceKey
 * @param {string} eventType
 * @returns {string}
 */
function getNotificationId (serviceKey = 'global', eventType) {
  return `${serviceKey}:${eventType}`
}

const serviceKey = 'social'

function getEvent (eventId, event) {
  return {
    id: eventId,
    key: getNotificationId(serviceKey, eventId),
    description: i18n.i18nInstance.__(event.keyDescription)
  }
}

router.get('/', asyncWrap(async (req, res) => {
  const subscriptions = []
  for (const eventId in notifyList) subscriptions.push(getEvent(eventId, notifyList[eventId]))
  res.json(subscriptions)
}))
