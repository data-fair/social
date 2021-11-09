<template>
  <div>
    <v-card
      flat
      outlined
    >
      <v-card-title class="py-1 px-2">
        <user-short :user="message.user" />
        <span class="caption text--secondary ml-2">{{ message.createdAt | fromNow }}</span>
        <v-spacer />
        <v-btn
          v-if="!message.responseTo"
          icon
          :title="$t('respond')"
          class="ml-2"
          color="primary"
          @click="responding=true"
        >
          <v-icon>mdi-comment-plus-outline</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pa-2">
        <pre style="white-space: pre-wrap">{{ message.content }}</pre>
      </v-card-text>
    </v-card>
    <message-list-topic
      v-if="!message.responseTo"
      :topic="message.topic"
      :response-to="message"
      :hide-send="!responding"
      :reverse="true"
      @cancel-response="responding=false"
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
