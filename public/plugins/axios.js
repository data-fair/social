export default function ({ $axios, store, route }) {
  $axios.onRequest(config => {
    // If the user is super admin and a ?owner=xxx is in the url, set the owner in any request params
    if (route.query.owner && store?.state?.session?.user?.adminMode) {
      config.params = config.params || {}
      config.params.owner = route.query.owner
    }
  })
}
