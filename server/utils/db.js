const debug = require('debug')('db')
const config = require('config')
const { MongoClient } = require('mongodb')

exports.ensureIndex = async (db, collection, key, options = {}) => {
  try {
    await db.collection(collection).createIndex(key, options)
  } catch (err) {
    if ((err.code !== 85 && err.code !== 86) || !options.name) throw err

    // if the error is a conflict on keys or params of the index we automatically
    // delete then recreate the index
    console.log(`Drop then recreate index ${collection}/${options.name}`)
    await db.collection(collection).dropIndex(options.name)
    await db.collection(collection).createIndex(key, options)
  }
}

exports.connect = async () => {
  debug('Connecting to mongodb ' + config.mongoUrl)
  const client = await MongoClient.connect(config.mongoUrl)
  const db = client.db()
  return { db, client }
}

exports.init = async (db) => {
  const promises = [
    exports.ensureIndex(db, 'favorites',
      { 'owner.type': 1, 'owner.id': 1, 'topic.key': 1, 'user.id': 1 }, { unique: true, name: 'main-keys' }),
    exports.ensureIndex(db, 'ratings',
      { 'owner.type': 1, 'owner.id': 1, 'topic.key': 1, 'user.id': 1 }, { unique: true, name: 'main-keys' }),
    exports.ensureIndex(db, 'messages',
      { 'owner.type': 1, 'owner.id': 1, 'topic.key': 1, createdAt: 1 }, { name: 'main-keys' })
  ]
  await Promise.all(promises)
}
