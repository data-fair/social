const axios = require('axios').default.create()
const config = require('config')

const EventEmitter = require('node:events')
const events = exports.events = new EventEmitter()
const notifyUrl = config.privateNotifyUrl || config.notifyUrl

/**
 * Send a notification
 * @param {{sender: {type: string, id: string}, topic: {key: string}, title: {[lang: string]: string}, extra: object, recipient: {id: string, name?: string}, outputs: string[]}} notification
 * @returns {Promise<void>}
 */
exports.send = async (notification) => {
  if (!notifyUrl) return
  if (notification?.topic?.key) events.emit(`notification-${notification.topic.key}`, notification)
  if (process.env.NODE_ENV !== 'test') {
    await axios.post(`${notifyUrl}/api/v1/notifications`, notification, { params: { key: config.globalAPIKey } })
      // .then(console.log)
      .catch(err => console.error('Failure to push notification', notification, err.response || err))
  }
}
