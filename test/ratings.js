const assert = require('assert').strict

describe('ratings', () => {
  it('Fail to read as anonymous', async () => {
    try {
      await global.ax.anonymous.get('/api/v1/ratings')
      assert.fail()
    } catch (err) {
      assert.equal(err.status, 401)
    }
  })

  it('Fail to read without a topic or user filter', async () => {
    try {
      await global.ax.dmeadus.get('/api/v1/ratings')
      assert.fail()
    } catch (err) {
      assert.equal(err.status, 400)
    }
  })

  it('Fail to create a rating without topic', async () => {
    try {
      await global.ax.dmeadus.post('/api/v1/ratings', {})
      assert.fail()
    } catch (err) {
      assert.equal(err.status, 400)
    }
  })

  it('Create a user rating', async () => {
    const rating = (await global.ax.dmeadus.post('/api/v1/ratings', {
      topic: { key: 'topic1', title: 'Topic 1' },
      score: 1
    })).data
    assert.equal(rating.owner.id, 'dmeadus0')
    const userRatings = (await global.ax.dmeadus.get('/api/v1/ratings', { params: { user: 'dmeadus0' } })).data
    assert.equal(userRatings.count, 1)
    const topicRatings = (await global.ax.dmeadus.get('/api/v1/ratings', { params: { topic: 'topic1' } })).data
    assert.equal(topicRatings.count, 1)
  })

  it('Create a user rating in an organization', async () => {
    const rating = (await global.ax.dmeadusOrg.post('/api/v1/ratings', {
      topic: { key: 'topic1', title: 'Topic 1' },
      score: 2
    })).data
    assert.equal(rating.owner.id, 'KWqAGZ4mG')
    const userRatings = (await global.ax.dmeadus.get('/api/v1/ratings', { params: { user: 'dmeadus0' } })).data
    assert.equal(userRatings.count, 1)
    const topicRatings = (await global.ax.dmeadus.get('/api/v1/ratings', { params: { topic: 'topic1' } })).data
    assert.equal(topicRatings.count, 0)
    const topicOrgRatings = (await global.ax.dmeadusOrg.get('/api/v1/ratings', { params: { topic: 'topic1' } })).data
    assert.equal(topicOrgRatings.count, 1)
  })

  it('Overwrite a user rating', async () => {
    await global.ax.dmeadus.post('/api/v1/ratings', {
      topic: { key: 'topic1', title: 'Topic 1' },
      score: 1
    })
    await new Promise((resolve) => setTimeout(resolve, 100))
    const rating = (await global.ax.dmeadus.post('/api/v1/ratings', {
      topic: { key: 'topic1', title: 'Topic 1' },
      score: 2
    })).data
    assert.equal(rating.score, 2)
    const userRatings = (await global.ax.dmeadus.get('/api/v1/ratings', { params: { user: 'dmeadus0' } })).data
    assert.equal(userRatings.count, 1)
    assert.equal(userRatings.results[0].score, 2)
  })
})
