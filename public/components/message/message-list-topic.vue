<template>
  <v-container
    v-if="messages && (messages.count || !hideSend)"
    fluid
    data-iframe-height
  >
    <message-send
      v-if="!hideSend"
      :topic="topic"
      :response-to="responseTo"
      :append-placeholder="(!responseTo && !messages.count) ? $t('noComment') : ''"
      :class="{'mb-0': !responseTo}"
      @sent="message => {messages.results.unshift(message); messages.count += 1; $emit('sent-response')}"
    />
    <!-- this div is required to make iframe-resizer work, it is broken by autofocus in iframe apparently -->
    <div
      v-if="!hideSend"
      data-iframe-height
      style="width:100%;height:1px;"
    />
    <template v-if="messages.count">
      <v-row
        v-if="messages.results.length < messages.count && reverse"
        :class="{'justify-center': !responseTo, 'mt-0': true}"
      >
        <v-col class="pt-0">
          <v-btn
            text
            color="primary"
            :loading="loading"
            :x-small="!!responseTo"
            @click="fetch(3, true)"
          >
            {{ responseTo ? $t('showMoreResponses') : $t('showMore') }}
          </v-btn>
        </v-col>
      </v-row>

      <v-slide-y-transition
        group
        class="mt-0 ml-0 row"
        tag="div"
      >
        <v-col
          v-for="message in sortedMessages"
          :key="message._id"
          cols="12"
          class="pt-0 pb-1 pl-0"
        >
          <message-card :message="message" />
        </v-col>
      </v-slide-y-transition>

      <v-row
        v-if="messages.results.length < messages.count && !reverse"
        class="justify-center mt-4"
      >
        <v-btn
          text
          color="primary"
          :loading="loading"
          :small="!!responseTo"
          @click="fetch(3, true)"
        >
          {{ responseTo ? $t('showMoreResponses') : $t('showMore') }}
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
        select: 'user,content,createdAt,responseTo,deletedAt,editedAt',
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
