<template>
  <v-container
    fluid
    data-iframe-height
  >
    <favorite-list
      :user="user"
      :prefix="$route.query.prefix"
      :url-template="$route.query['url-template']"
    />
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  layout: 'embed',
  computed: {
    ...mapState('session', ['user'])
  }
}
</script>
