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
          :rules="[value => value.length <= 200 || $t('tooLong'), value => value.split('\n').length <= 9 || $t('tooManyLineBreaks') ]"
          outlined
          :autofocus="!!responseTo"
          @keydown.enter="handleEnter"
        >
          <template #append-outer>
            <v-btn
              :fab="newMessage && valid"
              :small="newMessage && valid"
              color="primary"
              bottom
              :disabled="!newMessage || !valid"
              :icon="!newMessage || !valid"
              :title="$t('send')"
              @click="sendMessage"
            >
              <v-icon>mdi-send</v-icon>
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
  tooManyLineBreaks: Votre message est limité à 8 sauts de lignes
en:
  send: Send
  sendResponse: Respond
  message: type a comment
  respond: type a response
  tooLong: Your message is limited to 200 characters
  tooManyLineBreaks: Your message is limited to 8 line breaks

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
    // ctr-enter to send message
    handleEnter (e) {
      if (e.ctrlKey) this.sendMessage()
    },
    async sendMessage () {
      if (!this.newMessage || !this.valid) return
      this.sending = true
      const body = { topic: this.topic, content: this.newMessage.trim() }
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
.message-send .v-textarea {
  padding-right: 40px !important;
}
.message-send .v-input__append-outer {
  position: absolute;
  bottom: -4px;
  right: -2px;
}
.message-send .v-input__control {
  border-radius: 0;
}
</style>
