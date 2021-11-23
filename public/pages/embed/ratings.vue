<template>
  <v-container
    v-if="ratings"
    fluid
    data-iframe-height
  >
    <rating-edit
      v-if="topic && $route.query.edit === 'true'"
      :topic="topic"
      @change="fetch"
    />
    <template v-if="!ratings.count">
      <v-row class="justify-center ma-2">
        <v-alert
          type="info"
          outlined
        >
          {{ $t('noRating') }}
        </v-alert>
      </v-row>
    </template>
    <template v-else>
      <v-row class="px-4">
        <v-col>
          <span class="text-h1 text--secondary">{{ mean }}</span>
          <span
            class="text-h6 text--secondary"
            style="position:relative;bottom: 0"
          > / 5</span>
          <br>
          <span
            class="text-h6 text--secondary"
            style="position:relative;bottom: 0"
          >{{ $t('nbRatings', {count: ratings.count}) }}</span>
        </v-col>
        <v-col>
          <v-row
            v-for="i in [1,2,3,4,5]"
            :key="i"
            class="ma-0"
          >
            <div style="width:120px;display:inline;">
              <div
                v-for="j in i"
                :key="j"
                style="display:inline;float:right;"
              >
                <v-icon
                  color="default"
                  small
                >
                  mdi-star
                </v-icon>
              </div>
            </div>
            <div style="width: 150px;display:inline;margin-top:12px;margin-left:12px;">
              <v-progress-linear :value="((ratings.facets.score[i] || 0) / ratings.count) * 100" />
            </div>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          v-for="rating in ratings.results"
          :key="rating._id"
          cols="12"
          sm="6"
          md="4"
        >
          <rating-card :rating="rating" />
        </v-col>
      </v-row>
      <v-row
        v-if="ratings.results.length < ratings.count"
        class="justify-center"
      >
        <v-btn
          text
          color="primary"
          :loading="loading"
          @click="fetch(3, true)"
        >
          {{ $t('showMore') }}
        </v-btn>
      </v-row>
    </template>
  </v-container>
</template>

<i18n lang="yaml">
fr:
  nbRatings: "score moyen sur {count} évaluations"
  noRating: Aucune évaluation soumise
  showMore: Voir plus
en:
  nbRatings: "mean score over {count} ratings"
  noRating: No rating submitted
  showMore: Show more
</i18n>

<script>
export default {
  layout: 'embed',
  data () {
    return {
      topic: null,
      ratings: null,
      loading: false
    }
  },
  computed: {
    mean () {
      return Object.keys(this.ratings.facets.score)
        .reduce((sum, score) => sum + (score * this.ratings.facets.score[score]), 0) /
        this.ratings.count
    }
  },
  mounted () {
    if (!this.$route.query.key) throw new Error('query parameter "key" is required')
    if (!this.$route.query.title) throw new Error('query parameter "title" is required')
    this.topic = { key: this.$route.query.key, title: this.$route.query.title }
    this.fetch(3, false)
  },
  methods: {
    async fetch (size, concat) {
      this.loading = true
      const ratings = (await this.$axios.$get('api/v1/ratings', {
        params: {
          topic: this.topic.key,
          skip: concat ? this.ratings.results.length : 0,
          size,
          select: 'user,score,comment,createdAt',
          facet: concat ? '' : 'score'
        }
      }))
      if (concat) this.ratings.results = this.ratings.results.concat(ratings.results)
      else this.ratings = ratings
      this.loading = false
    }
  }
}
</script>
