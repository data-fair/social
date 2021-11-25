<template>
  <v-row
    class="message-send"
    data-iframe-height
  >
    <v-col>
      <v-form v-model="valid">
        <v-textarea
          v-model="newMessage"
          hide-details="auto"
          :rows="1"
          auto-grow
          dense
          outlined
          :placeholder="responseTo ? $t('respond') : $t('message', {append: appendPlaceholder})"
          :rules="[value => value.length <= 200 || $t('tooLong'), value => value.split('\n').length <= 9 || $t('tooManyLineBreaks') ]"
          :autofocus="!!responseTo"
          @keydown.enter="handleEnter"
        >
          <template #append-outer>
            <v-btn
              :fab="newMessage && valid"
              :small="newMessage && valid"
              color="primary"
              bottom
              :disabled="disabled"
              :icon="!newMessage || !valid"
              :title="$t('send')"
              :loading="sending"
              @click="sendMessage"
            >
              <v-icon v-if="editMessage">
                mdi-pencil
              </v-icon>
              <v-icon v-else>
                mdi-send
              </v-icon>
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
  message: saisissez un commentaire {append}
  respond: saisissez une réponse
  tooLong: Votre message est limité à 200 caractères
  tooManyLineBreaks: Votre message est limité à 8 sauts de lignes
en:
  send: Send
  sendResponse: Respond
  message: type a comment {append}
  respond: type a response
  tooLong: Your message is limited to 200 characters
  tooManyLineBreaks: Your message is limited to 8 line breaks

</i18n>

<script>
export default {
  props: {
    topic: { type: Object, default: null },
    responseTo: { type: Object, required: false, default: null },
    editMessage: { type: Object, required: false, default: null },
    appendPlaceholder: { type: String, required: false, default: null }
  },
  data () {
    return {
      valid: null,
      newMessage: '',
      sending: false
    }
  },
  computed: {
    disabled () {
      return !this.newMessage || !this.valid || (this.editMessage && this.editMessage.content.trim() === this.newMessage.trim())
    }
  },
  created () {
    if (this.editMessage) this.newMessage = this.editMessage.content
  },
  methods: {
    // ctr-enter to send message
    handleEnter (e) {
      if (e.ctrlKey) this.sendMessage()
    },
    async sendMessage () {
      if (this.disabled) return

      this.sending = true
      if (this.editMessage) {
        await this.$axios.$put(`api/v1/messages/${this.editMessage._id}/content`, this.newMessage, { headers: { 'Content-Type': 'text/plain' } })
        this.$set(this.editMessage, 'editedAt', new Date().toISOString())
        this.$set(this.editMessage, 'content', this.newMessage)
        this.$emit('sent', this.editMessage)
      } else {
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
      }
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
</style>
