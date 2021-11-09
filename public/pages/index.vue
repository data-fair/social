<template>
  <v-row
    v-if="initialized"
    class="home my-0"
  />
</template>

<i18n lang="yaml">
fr:
  title: Data Fair
en:
</i18n>

<script>
const { mapState, mapActions, mapGetters } = require('vuex')

export default {
  components: {},
  data: () => ({}),
  computed: {
    ...mapState('session', ['user', 'initialized']),
    ...mapGetters('session', ['activeAccount'])
  },
  methods: {
    ...mapActions('session', ['login'])
  }
}
</script>
