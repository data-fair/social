export default function ({ $axios, store, route }) {
  $axios.onRequest(config => {
    // If the user is super admin and a ?ownerId=orga1&ownerName=Organisation&ownerType=organization is in the url, set the owner in any request params
    if (route.query.ownerId && route.query.ownerName && route.query.ownerType && store?.state?.session?.user?.adminMode) {
      config.params = config.params || {}
      config.params.ownerId = route.query.ownerId
      config.params.ownerName = route.query.ownerName
      config.params.ownerType = route.query.ownerType
    }
  })
}
