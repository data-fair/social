const owner = require('../../contract/partial/owner')

export default function ({ $axios, store, route }) {
  $axios.onRequest(config => {
    // If the user is super admin and a ?ownerId=orga1&ownerName=Organisation&ownerType=organization is in the url, set the owner in any request params
    if (route.query.ownerId && route.query.ownerName && route.query.ownerType && store?.state?.session?.user?.adminMode) {
      config.headers = config.headers || {}
      config.headers['x-owner-id'] = route.query.ownerId
      config.headers['x-owner-name'] = route.query.ownerName
      config.headers['x-owner-type'] = route.query.ownerType
    }
  })
}
