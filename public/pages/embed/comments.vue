<template>
  <v-container v-if="messages">
    <message-send
      :topic="topic"
      @sent="message => {messages.results.unshift(message); messages.count += 1}"
    />
    <v-row
      v-if="!messages.count"
      class="justify-center ma-2"
    >
      <v-alert
        type="info"
        outlined
      >
        {{ $t('noComment') }}
      </v-alert>
    </v-row>
    <template v-else>
      <v-row>
        <v-col
          v-for="message in messages.results"
          :key="message._id"
          cols="12"
          class="pt-0"
        >
          <message-card :message="message" />
        </v-col>
      </v-row>
      <v-row
        v-if="messages.results.length < messages.count"
        class="justify-center mt-6"
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
  noComment: Aucune commentaire soumis
  send: Envoyer
  tooLong: Votre message est limité à 200 caractères
en:
  noComment: No comment submitted
  send: Send
  tooLong: Your message is limited to 200 characters
</i18n>

<script>
export default {
  layout: 'embed',
  data () {
    return {
      topic: null,
      messages: null,
      loading: false
    }
  },
  computed: {
    mean () {
      return Object.keys(this.messages.facets.score)
        .reduce((sum, score) => sum + (score * this.messages.facets.score[score]), 0) /
        this.messages.count
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
      const messages = (await this.$axios.$get('api/v1/messages', {
        params: {
          topic: this.topic.key,
          before: concat ? this.messages.results[this.messages.results.length - 1].createdAt : '',
          size,
          select: 'user,content,createdAt,responseTo'
        }
      }))
      if (concat) this.messages.results = this.messages.results.concat(messages.results)
      else this.messages = messages
      this.loading = false
    }
  }
}
</script>
