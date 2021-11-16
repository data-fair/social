<template>
  <v-container
    v-if="!loading"
    fluid
  >
    <v-icon
      v-if="favorite"
      color="accent"
      :title="$t('deleteFavorite', {title: topic.title})"
      @click="deleteFavorite"
    >
      mdi-star
    </v-icon>
    <v-icon
      v-else
      :title="$t('createFavorite', {title: topic.title})"
      @click="createFavorite"
    >
      mdi-star-outline
    </v-icon>
  </v-container>
</template>

<i18n lang="yaml">
fr:
  createFavorite: Ajouter "{title}" à vos favoris
  deleteFavorite: Enlever "{title}" de vos favoris
en:
  createFavorite: Add "{title}" to your favorites
  deleteFavorite: Remove "{title}" from your favorites
</i18n>

<script>
import { mapState } from 'vuex'

export default {
  layout: 'embed',
  data () {
    return {
      favorite: null,
      loading: true
    }
  },
  computed: {
    ...mapState('session', ['user']),
    topic () {
      return { key: this.$route.query.key, title: this.$route.query.title }
    }
  },
  mounted () {
    if (!this.topic.key) return console.error('query parameter "key" is required')
    if (!this.topic.title) return console.error('query parameter "title" is required')
    this.fetch()
  },
  methods: {
    async fetch () {
      this.favorite = (await this.$axios.$get('api/v1/favorites', { params: { topic: this.topic.key, user: this.user.id } })).results[0]
      this.loading = false
    },
    async createFavorite () {
      this.favorite = await this.$axios.$post('api/v1/favorites', { topic: this.topic })
    },
    async deleteFavorite () {
      await this.$axios.$delete(`api/v1/favorites/${this.favorite._id}`)
      this.favorite = null
    }
  }
}
</script>
