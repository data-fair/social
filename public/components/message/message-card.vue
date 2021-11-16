<template>
  <div>
    <v-card
      flat
      :outlined="!message.responseTo"
      tile
    >
      <v-card-title class="py-1 px-1">
        <user-short :user="message.user" />
        <span
          class="caption text--secondary ml-2"
          :title="$dayjs(message.createdAt).format('LLL')"
        >{{ message.createdAt | fromNow }}</span>
        <v-spacer />
      </v-card-title>
      <v-card-text class="px-2 py-0">
        <pre
          style="white-space: pre-wrap"
          class="text-caption"
        >{{ message.content }}</pre>
      </v-card-text>
      <v-card-actions
        v-if="!message.responseTo"
        class="px-1 pt-0 pb-1"
      >
        <v-btn
          x-small
          text
          :title="$t('respond')"
          color="primary"
          @click="responding=!responding"
        >
          répondre
        </v-btn>
      </v-card-actions>
    </v-card>
    <message-list-topic
      v-if="!message.responseTo"
      :topic="message.topic"
      :response-to="message"
      :hide-send="!responding"
      :reverse="true"
      class="pa-0 pb-2 ml-4 pr-8 mb-2"
      style="border-left: 1px solid rgba(0,0,0,.12);"
      @sent-response="responding = false"
    />
  </div>
</template>

<i18n lang="yaml">
fr:
  respond: Répondre
en:
  respond: Respond
</i18n>

<script>
export default {
  props: {
    message: { type: Object, required: true }
  },
  data () {
    return {
      responding: false
    }
  }
}
</script>

<style>

</style>
