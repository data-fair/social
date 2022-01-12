<template>
  <v-container
    v-if="notes && (notes.count || !hideSend)"
    fluid
    data-iframe-height
  >
    <note-send
      v-if="!hideSend && canEdit"
      :topic="topic"
      :append-placeholder="!notes.count ? $t('noComment') : ''"
      class="mb-0"
      @sent="note => {notes.results.unshift(note); notes.count += 1; $emit('sent-response')}"
    />
    <template v-if="notes.count">
      <v-slide-y-transition
        group
        class="mt-0 ml-0 row"
        tag="div"
      >
        <v-col
          v-for="(note, i) in notes.results"
          :key="note._id"
          cols="12"
          class="pt-0 pb-1 pl-0"
        >
          <note-card
            :note="note"
            :last="i === notes.results.length - 1"
            @delete="noteId => {notes.results = notes.results.filter(n => n._id !== noteId); notes.count -= 1;}"
          />
        </v-col>
      </v-slide-y-transition>

      <v-row
        v-if="notes.results.length < notes.count"
        class="justify-center mt-4"
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
  noComment: " - aucun commentaire soumis"
  showMore: Plus de commentaires
  showMoreResponses: Réponses précédentes
en:
  noComment: " - no comment submitted"
  showMore: More comments
  showMoreResponses: Previous responses
</i18n>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    topic: { type: Object, required: true },
    hideSend: { type: Boolean, default: false }
  },
  data () {
    return {
      notes: null,
      loading: false
    }
  },
  computed: {
    ...mapState('session', ['user']),
    canEdit () {
      // if (process.env.allowedEditRoles && this.user && this.user.organization) return process.env.allowedEditRoles.includes(this.user.organization.role)
      return !!this.user
    }
  },
  mounted () {
    this.fetch(3, false)
  },
  methods: {
    async fetch (size, concat) {
      this.loading = true
      const params = {
        topic: this.topic.key,
        before: concat ? this.notes.results[this.notes.results.length - 1].createdAt : '',
        size,
        select: 'user,content,createdAt,editedAt,owner',
        sort: 'createdAt:-1'
      }
      const notes = (await this.$axios.$get('api/v1/notes', { params }))
      notes.results.forEach(r => {
        r.topic = this.topic
      })
      if (concat) this.notes.results = this.notes.results.concat(notes.results)
      else this.notes = notes
      this.loading = false
    }
  }
}
</script>
