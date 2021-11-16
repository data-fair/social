<template>
  <v-container
    v-if="initialized && user"
    fluid
    class="home my-0"
  >
    <v-row>
      <v-col
        cols="12"
        sm="6"
        md="4"
        xl="3"
      >
        <v-card>
          <v-card-title>
            {{ $t('favorites') }}
          </v-card-title>
          <v-card-text class="pa-0">
            <favorite-list :user="user" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="4"
        xl="3"
      >
        <v-card>
          <v-card-title>
            {{ $t('ratings') }}
          </v-card-title>
          <v-card-text class="pa-0">
            <rating-list :user="user" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="4"
        xl="3"
      >
        <v-card>
          <v-card-title>
            {{ $t('messages') }}
          </v-card-title>
          <v-card-text class="pa-0">
            <message-list :user="user" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<i18n lang="yaml">
fr:
  favorites: Mes favoris
  ratings: Mes évaluations
  messages: Mes messages
en:
  favorites: My favorites
  ratings: My ratings
  messages: My messages
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
