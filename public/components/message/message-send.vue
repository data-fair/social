<template>
  <v-row>
    <v-col>
      <v-form v-model="valid">
        <v-textarea
          v-model="newMessage"
          outlined
          hide-details="auto"
          :label="$t('message')"
          :rules="[value => value.length <= 200 || $t('tooLong') ]"
        />
      </v-form>
      <v-row class="mx-0 mt-2 mb-0">
        <v-spacer />
        <v-btn
          color="primary"
          :disabled="!newMessage || !valid"
          @click="sendMessage"
        >
          {{ $t('send') }}
        </v-btn>
      </v-row>
    </v-col>
  </v-row>
</template>

<i18n lang="yaml">
fr:
  send: Envoyer
  message: Saisissez un commentaire
en:
  send: Send
  message: Type a comment
</i18n>

<script>
export default {
  props: {
    topic: { type: Object, required: true }
  },
  data () {
    return {
      valid: null,
      newMessage: '',
      sending: false
    }
  },
  methods: {
    async sendMessage () {
      if (!this.newMessage || !this.valid) return
      this.sending = true
      const message = await this.$axios.$post('api/v1/messages', { topic: this.topic, content: this.newMessage })
      this.$emit('sent', message)
      this.newMessage = ''
      this.sending = false
    }
  }
}
</script>

<style>

</style>
