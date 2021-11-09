<template>
  <v-container
    v-if="messages && (messages.count || !hideSend)"
    :class="{'pl-8': responseTo}"
  >
    <message-send
      v-if="!hideSend"
      :topic="topic"
      :response-to="responseTo"
      @sent="message => {messages.results.unshift(message); messages.count += 1}"
      @cancel="$emit('cancel-response')"
    />
    <v-row
      v-if="!messages.count && !responseTo"
      class="justify-center ma-2"
    >
      <v-alert
        type="info"
        outlined
      >
        {{ $t('noComment') }}
      </v-alert>
    </v-row>
    <template v-if="messages.count">
      <v-row
        v-if="messages.results.length < messages.count && reverse"
        class="justify-center my-1"
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

      <v-slide-y-transition
        group
        class="mt-1"
        tag="v-row"
      >
        <v-col
          v-for="message in sortedMessages"
          :key="message._id"
          cols="12"
          class="pt-0"
        >
          <message-card :message="message" />
        </v-col>
      </v-slide-y-transition>

      <v-row
        v-if="messages.results.length < messages.count && !reverse"
        class="justify-center my-1"
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
  tooLong: Votre message est limité à 200 caractères
  showMore: Voir plus
en:
  noComment: No comment submitted
  tooLong: Your message is limited to 200 characters
  showMore: Show more
</i18n>

<script>
export default {
  props: {
    topic: { type: Object, required: true },
    responseTo: { type: Object, required: false, default: null },
    hideSend: { type: Boolean, default: false },
    reverse: { type: Boolean, default: false }
  },
  data () {
    return {
      messages: null,
      loading: false
    }
  },
  computed: {
    sortedMessages () {
      if (this.reverse) return [...this.messages.results].reverse()
      else return this.messages.results
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
        before: concat ? this.messages.results[this.messages.results.length - 1].createdAt : '',
        size,
        select: 'user,content,createdAt,responseTo',
        responseTo: this.responseTo ? this.responseTo._id : 'null',
        sort: 'createdAt:-1'
      }
      const messages = (await this.$axios.$get('api/v1/messages', { params }))
      messages.results.forEach(r => {
        r.topic = this.topic
      })
      if (concat) this.messages.results = this.messages.results.concat(messages.results)
      else this.messages = messages
      this.loading = false
    }
  }
}
</script>
