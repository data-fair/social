<template>
  <v-list
    v-if="favorites"
    dense
    class="py-0"
  >
    <v-list-item
      v-if="favorites.count === 0"
      class="justify-center my-1"
    >
      {{ $t('noFavorite') }}
    </v-list-item>
    <v-list-item
      v-for="favorite in favorites.results"
      :key="favorite._id"
    >
      <v-list-item-content>
        <v-list-item-title>
          {{ favorite.topic.title }} ({{ favorite.topic.key }})
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ favorite.createdAt | fromNow }}
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-btn
          icon
          color="warning"
          @click="deleteFavorite(favorite._id)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
    <v-list-item
      v-if="favorites.results.length < favorites.count"
      class="justify-center my-1"
      :disabled="loading"
      @click="fetch(5, true)"
    >
      {{ $t('showMore') }}
    </v-list-item>
  </v-list>
</template>

<i18n lang="yaml">
fr:
  noFavorite: Aucun favori enregistré
  showMore: Voir plus
en:
  noFavorite: No favorite saved
  showMore: Show more
</i18n>

<script>
export default {
  props: {
    user: { type: Object, required: true }
  },
  data () {
    return {
      favorites: null
    }
  },
  created () {
    this.fetch(5, false)
  },
  methods: {
    async fetch (size, concat) {
      this.loading = true
      const favorites = (await this.$axios.$get('api/v1/favorites', {
        params: {
          sort: 'createdAt:-1',
          user: this.user.id,
          skip: concat ? this.favorites.results.length : 0,
          size,
          select: 'createdAt,topic,_id'
        }
      }))
      if (concat) this.favorites.results = this.favorites.results.concat(favorites.results)
      else this.favorites = favorites
      this.loading = false
    },
    async deleteFavorite (id) {
      await this.$axios.$delete(`api/v1/favorites/${id}`)
      this.favorites.count -= 1
      this.favorites.results = this.favorites.results.filter(f => f._id !== id)
    }
  }
}
</script>

<style>

</style>
