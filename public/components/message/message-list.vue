<template>
  <v-list
    v-if="messages"
    dense
    class="py-0"
  >
    <v-list-item
      v-if="messages.count === 0"
      class="justify-center my-1"
    >
      {{ $t('noMessage') }}
    </v-list-item>
    <v-list-item
      v-for="message in messages.results"
      :key="message._id"
    >
      <v-list-item-content>
        <v-list-item-title>
          {{ message.topic.title }} ({{ message.topic.key }})
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ message.createdAt | fromNow }}
          <span v-if="message.responseTo">{{ $t('responseTo', {user: message.responseTo.user.name}) }}</span>
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          {{ message.content }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item
      v-if="messages.results.length < messages.count"
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
  noMessage: Aucun message enregistré
  showMore: Voir plus
  responseTo: "en réponse à {user}"
en:
  noMessage: No message saved
  showMore: Show more
  responseTo: "responding to {user}"
</i18n>

<script>
export default {
  props: {
    user: { type: Object, required: true }
  },
  data () {
    return {
      messages: null
    }
  },
  created () {
    this.fetch(5, false)
  },
  methods: {
    async fetch (size, concat) {
      this.loading = true
      const messages = (await this.$axios.$get('api/v1/messages', {
        params: {
          sort: 'createdAt:-1',
          user: this.user.id,
          skip: concat ? this.messages.results.length : 0,
          size,
          select: 'createdAt,topic,content,responseTo,_id'
        }
      }))
      if (concat) this.messages.results = this.messages.results.concat(messages.results)
      else this.messages = messages
      this.loading = false
    }
  }
}
</script>

<style>

</style>
