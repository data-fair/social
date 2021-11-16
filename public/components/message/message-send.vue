<template>
  <v-row class="message-send">
    <v-col>
      <v-form v-model="valid">
        <v-textarea
          v-model="newMessage"
          hide-details="auto"
          :rows="1"
          auto-grow
          dense
          :placeholder="responseTo ? $t('respond') : $t('message')"
          :rules="[value => value.length <= 200 || $t('tooLong') ]"
          :flat="!!responseTo"
          :solo="!!responseTo"
          :outlined="!responseTo"
          :autofocus="!!responseTo"
        >
          <template #append-outer>
            <v-btn
              icon
              color="primary"
              bottom
              :disabled="!newMessage || !valid"
              :title="$t('send')"
              @click="sendMessage"
            >
              <v-icon>mdi-comment</v-icon>
            </v-btn>
          </template>
        </v-textarea>
      </v-form>
    </v-col>
  </v-row>
</template>

<i18n lang="yaml">
fr:
  send: Envoyer
  sendResponse: Répondre
  message: saisissez un commentaire
  respond: saisissez une réponse
  tooLong: Votre message est limité à 200 caractères
en:
  send: Send
  sendResponse: Respond
  message: type a comment
  respond: type a response
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
.message-send {
  position: relative;
}
.message-send .v-textarea {
  padding-right: 40px !important;
}
.message-send .v-input__append-outer {
  position: absolute;
  bottom: -3px;
  right: 0;
}
</style>
