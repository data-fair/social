const assert = require('assert').strict

describe('favorites', () => {
  it('Fail to read as anonymous', async () => {
    try {
      await global.ax.anonymous.get('/api/v1/favorites')
      assert.fail()
    } catch (err) {
      assert.equal(err.status, 401)
    }
  })

  it('Fail to create a favorite without topic', async () => {
    try {
      await global.ax.dmeadus.post('/api/v1/favorites', {})
      assert.fail()
    } catch (err) {
      assert.equal(err.status, 400)
    }
  })

  it('Create a user favorite', async () => {
    const favorite = (await global.ax.dmeadus.post('/api/v1/favorites', { topic: { key: 'topic1', title: 'Topic 1' } })).data
    assert.equal(favorite.owner.id, 'dmeadus0')
    const userFavorites = (await global.ax.dmeadus.get('/api/v1/favorites', { params: { user: 'dmeadus0' } })).data
    assert.equal(userFavorites.count, 1)
    const topicFavorites = (await global.ax.dmeadus.get('/api/v1/favorites', { params: { topic: 'topic1' } })).data
    assert.equal(topicFavorites.count, 1)
  })

  it('Create a user favorite in an organization', async () => {
    const favorite = (await global.ax.dmeadusOrg.post('/api/v1/favorites', { topic: { key: 'topic1', title: 'Topic 1' } })).data
    assert.equal(favorite.owner.id, 'KWqAGZ4mG')
    const userFavorites = (await global.ax.dmeadusOrg.get('/api/v1/favorites', { params: { user: 'dmeadus0' } })).data
    assert.equal(userFavorites.count, 1)
    const topicFavorites = (await global.ax.dmeadus.get('/api/v1/favorites', { params: { topic: 'topic1' } })).data
    assert.equal(topicFavorites.count, 0)
    const topicOrgFavorites = (await global.ax.dmeadusOrg.get('/api/v1/favorites', { params: { topic: 'topic1' } })).data
    assert.equal(topicOrgFavorites.count, 1)
  })

  it('Delete a user favorite', async () => {
    const favorite = (await global.ax.dmeadus.post('/api/v1/favorites', { topic: { key: 'topic1', title: 'Topic 1' } })).data
    await global.ax.dmeadus.delete('/api/v1/favorites/' + favorite._id)
    const userFavorites = (await global.ax.dmeadus.get('/api/v1/favorites', { params: { user: 'dmeadus0' } })).data
    assert.equal(userFavorites.count, 0)
  })
})
