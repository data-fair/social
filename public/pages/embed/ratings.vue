<template>
  <v-container v-if="ratings">
    <v-row
      v-if="ratings.length"
      class="px-4"
    >
      <v-col>
        <span class="text-h1 text--secondary">{{ mean }}</span>
        <span
          class="text-h6 text--disabled"
          style="position:relative;bottom: 0"
        > / 5</span>
        &nbsp;&nbsp;
        <span
          class="text-h6 text--secondary"
          style="position:relative;bottom: 0"
        >{{ $t('nbRatings', {count: ratings.length}) }}</span>
      </v-col>
      <v-col>
        <v-row
          v-for="i in [1,2,3,4,5]"
          :key="i"
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
            <v-progress-linear :value="(ratings.filter(r => r.score === i).length / ratings.length) * 100" />
          </div>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="rating in ratings"
        :key="rating._id"
        cols="12"
        sm="6"
        md="4"
      >
        <rating-card :rating="rating" />
      </v-col>
    </v-row>
  </v-container>
</template>

<i18n lang="yaml">
fr:
  nbRatings: "{count} évaluations"
en:
  nbRatings: "{count} ratings"
</i18n>

<script>
export default {
  layout: 'embed',
  data () {
    return { topic: null, ratings: null }
  },
  computed: {
    mean () {
      return this.ratings.reduce((sum, rating) => sum + rating.score, 0) / this.ratings.length
    }
  },
  mounted () {
    if (!this.$route.query.key) throw new Error('query parameter "key" is required')
    if (!this.$route.query.title) throw new Error('query parameter "title" is required')
    this.topic = { key: this.$route.query.key, title: this.$route.query.title }
    this.fetch()
  },
  methods: {
    async fetch () {
      this.ratings = (await this.$axios.$get('api/v1/ratings', {
        params: { topic: this.topic.key, size: 10000, select: 'user,score,comment' }
      })).results
    }
  }
}
</script>
