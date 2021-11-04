<template>
  <v-row v-if="!loading">
    <v-col>
      <v-row>
        <v-col>{{ $t('rate', {title: topic.title}) }}</v-col>
      </v-row>
      <v-row
        class="ma-0"
        style="height:36px;"
        align="center"
      >
        <div
          v-for="i in [1, 2, 3, 4, 5]"
          :key="i"
          style="display:inline;"
        >
          <v-icon
            :color="rating.score >= i ? 'accent' : 'default'"
            :title="$t('setScore', {i})"
            @click="rating.score = i; saveRating()"
          >
            {{ rating.score >= i ? 'mdi-star' : 'mdi-star-outline' }}
          </v-icon>
        </div>
        <v-spacer />
        <v-btn
          v-if="rating._id"
          icon
          color="warning"
          :title="$t('deleteRating')"
          @click="deleteRating"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-row>
      <v-row class="mt-0">
        <v-col class="pt-1">
          <v-textarea
            v-if="!!rating.score"
            v-model="rating.comment"
            outlined
            hide-details
            :label="$t('comment')"
            @change="saveRating"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<i18n lang="yaml">
fr:
  rate: Évaluez {title}
  setScore: Attribuer une note de {i}/5
  deleteRating: Supprimer votre évaluation
  comment: Commentaire
en:
  rate: Rate {title}
  setScore: Give a score of {i}/5
  deleteRating: Delete your rating
  comment: Comment
</i18n>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    topic: { type: Object, required: true }
  },
  data () {
    return {
      rating: null,
      loading: true
    }
  },
  computed: {
    ...mapState('session', ['user'])
  },
  mounted () {
    this.fetch()
  },
  methods: {
    emptyRating () {
      this.rating = { score: 0, comment: '', topic: this.topic }
    },
    async fetch () {
      this.rating = (await this.$axios.$get('api/v1/ratings', { params: { topic: this.topic.key, user: this.user.id } })).results[0]
      if (!this.rating) this.emptyRating()
      this.loading = false
    },
    async saveRating () {
      if (!this.rating.score) return
      this.rating = await this.$axios.$post('api/v1/ratings', this.rating)
    },
    async deleteRating () {
      await this.$axios.$delete(`api/v1/ratings/${this.rating._id}`)
      this.emptyRating()
    }
  }
}
</script>
