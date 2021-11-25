<template>
  <v-container
    v-if="ratings"
    fluid
    data-iframe-height
  >
    <rating-edit
      v-if="topic && $route.query.edit === 'true'"
      :topic="topic"
      :subtitle="!ratings.count ? $t('noRating') : ''"
      @change="fetch"
    />
    <template v-if="ratings && ratings.count">
      <v-row class="px-4 mt-1">
        <v-col>
          <span class="text-h2 text--secondary">{{ $n(mean, {maximumSignificantDigits: 2}) }}</span>
          <span
            class="text-h6 text--secondary"
            style="position:relative;bottom: 0"
          > / 5</span>
          <br>
          <span
            class="text-h6 text--secondary"
            style="position:relative;bottom: 0"
          >{{ $tc('nbRatings', ratings.count, {count: ratings.count}) }}</span>
        </v-col>
        <v-col class="px-0">
          <v-row
            v-for="i in [1,2,3,4,5]"
            :key="i"
            class="ma-0"
          >
            <div style="width:60px;display:inline;">
              <div
                v-for="j in i"
                :key="j"
                style="display:inline;float:right;height:18px;"
              >
                <v-icon
                  color="default"
                  x-small
                >
                  mdi-star
                </v-icon>
              </div>
            </div>
            <div :style="`width:${$vuetify.breakpoint.smAndDown ? '60px' : '150px'};display:inline;margin-top:10px;margin-left:12px;`">
              <v-progress-linear
                color="accent"
                rounded
                :value="((ratings.facets.score[i] || 0) / ratings.count) * 100"
              />
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
  nbRatings: " | 1 évaluation | score moyen sur {count} évaluations"
  noRating: aucune évaluation soumise
  showMore: Voir plus
en:
  nbRatings: " | 1 rating | mean score over {count} ratings"
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
      console.log(ratings)
      if (concat) this.ratings.results = this.ratings.results.concat(ratings.results)
      else this.ratings = ratings
      this.loading = false
    }
  }
}
</script>
