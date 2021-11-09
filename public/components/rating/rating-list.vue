<template>
  <v-list
    v-if="ratings"
    dense
    class="py-0"
  >
    <v-list-item
      v-if="ratings.count === 0"
      class="justify-center my-1"
    >
      {{ $t('noRating') }}
    </v-list-item>
    <v-list-item
      v-for="rating in ratings.results"
      :key="rating._id"
    >
      <v-list-item-content>
        <v-list-item-title>
          {{ rating.topic.title }} ({{ rating.topic.key }})
          <rating-stars
            :value="rating.score"
            :editable="false"
          />
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ rating.createdAt | fromNow }}
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          {{ rating.comment }}
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-btn
          icon
          color="warning"
          @click="deleterating(rating._id)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
    <v-list-item
      v-if="ratings.results.length < ratings.count"
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
  noRating: Aucun favori enregistré
  showMore: Voir plus
en:
  noRating: No rating saved
  showMore: Show more
</i18n>

<script>
export default {
  props: {
    user: { type: Object, required: true }
  },
  data () {
    return {
      ratings: null
    }
  },
  created () {
    this.fetch(5, false)
  },
  methods: {
    async fetch (size, concat) {
      this.loading = true
      const ratings = (await this.$axios.$get('api/v1/ratings', {
        params: {
          sort: 'createdAt:-1',
          user: this.user.id,
          skip: concat ? this.ratings.results.length : 0,
          size,
          select: 'createdAt,topic,score,comment,_id'
        }
      }))
      if (concat) this.ratings.results = this.ratings.results.concat(ratings.results)
      else this.ratings = ratings
      this.loading = false
    },
    async deleterating (id) {
      await this.$axios.$delete(`api/v1/ratings/${id}`)
      this.ratings.count -= 1
      this.ratings.results = this.ratings.results.filter(f => f._id !== id)
    }
  }
}
</script>

<style>

</style>
