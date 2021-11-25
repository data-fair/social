<template>
  <v-row
    v-if="!loading"
    class="rating-edit"
  >
    <v-col class="pb-1">
      <v-row>
        <v-col>
          {{ $t('rate', {title: topic.title}) }}
          <span
            v-if="subtitle"
            class="text-caption text--secondary font-italic"
          > - {{ subtitle }}</span>
        </v-col>
      </v-row>
      <v-row
        class="ma-0"
        align="center"
      >
        <rating-stars
          v-model="rating.score"
          @input="saveRating"
        />
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
      <v-row
        v-if="!!rating.score"
        class="mt-1 mb-0"
      >
        <v-col class="py-0">
          <rating-comment
            v-model="rating.comment"
            :sending="sending"
            @input="saveRating"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<i18n lang="yaml">
fr:
  rate: Évaluez {title}
  deleteRating: Supprimer votre évaluation
en:
  rate: Rate {title}
  deleteRating: Delete your rating
</i18n>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    topic: { type: Object, required: true },
    subtitle: { type: String, default: null }
  },
  data () {
    return {
      rating: null,
      loading: true,
      sending: false
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
      this.sending = true
      this.rating = await this.$axios.$post('api/v1/ratings', this.rating)
      this.$emit('change')
      this.sending = false
    },
    async deleteRating () {
      await this.$axios.$delete(`api/v1/ratings/${this.rating._id}`)
      this.emptyRating()
      this.$emit('change')
    }
  }
}
</script>

<style>
.rating-edit .v-textarea {
  padding-right: 40px !important;
}
.rating-edit .v-textarea .v-input__append-outer {
  position: absolute;
  bottom: -4px;
  right: -2px;
}
</style>
