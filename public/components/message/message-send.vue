<template>
  <v-row>
    <v-col>
      <v-form v-model="valid">
        <v-textarea
          v-model="newMessage"
          outlined
          hide-details="auto"
          :label="responseTo ? $t('respond') : $t('message')"
          :rules="[value => value.length <= 200 || $t('tooLong') ]"
        />
      </v-form>
      <v-row class="mx-0 my-2">
        <v-spacer />
        <v-btn
          v-if="responseTo"
          text
          class="mr-2"
          @click="$emit('cancel')"
        >
          {{ $t('cancel') }}
        </v-btn>
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
  cancel: Annuler
  message: Saisissez un commentaire
  respond: Saisissez une réponse
  tooLong: Votre message est limité à 200 caractères
en:
  send: Send
  cancel: Cancel
  message: Type a comment
  respond: Type a response
  tooLong: Your message is limited to 200 characters
</i18n>

<script>
export default {
  props: {
    topic: { type: Object, required: true },
    responseTo: { type: Object, required: false, default: null }
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
      const body = { topic: this.topic, content: this.newMessage }
      if (this.responseTo) {
        body.responseTo = {
          _id: this.responseTo._id,
          user: this.responseTo.user,
          createdAt: this.responseTo.createdAt
        }
      }
      const message = await this.$axios.$post('api/v1/messages', body)
      this.$emit('sent', message)
      this.newMessage = ''
      this.sending = false
    }
  }
}
</script>

<style>

</style>
