<template>
  <v-row class="note-send">
    <v-col>
      <v-form v-model="valid">
        <v-textarea
          v-model="newNote"
          hide-details="auto"
          :rows="1"
          auto-grow
          dense
          outlined
          :placeholder="$t('message', {append: appendPlaceholder})"
          :rules="[value => value.length <= messageMaxLength || $tc('tooLong', messageMaxLength, { nb: messageMaxLength }), value => value.split('\n').length <= 9 || $t('tooManyLineBreaks') ]"
          autofocus
          @keydown.enter="handleEnter"
          @keydown.esc="handleEsc"
        >
          <template #append-outer>
            <v-btn
              :fab="newNote && valid"
              :small="newNote && valid"
              color="primary"
              bottom
              :disabled="disabled"
              :icon="!newNote || !valid"
              :title="$t('send')"
              :loading="sending"
              @click="sendNote"
            >
              <v-icon v-if="editNote">
                mdi-pencil
              </v-icon>
              <v-icon v-else>
                mdi-send
              </v-icon>
            </v-btn>
          </template>
        </v-textarea>
        <small class="text--disabled">{{ $t('markdown') }}&nbsp;(<a
          href="https://www.markdownguide.org/cheat-sheet"
          target="_blank"
        >?</a>)</small>
      </v-form>
    </v-col>
  </v-row>
</template>

<i18n lang="yaml">
fr:
  send: Envoyer
  message: saisissez un commentaire {append}
  tooLong: " | Votre commentaire est limité à 1 caractère | Votre commentaire est limité à {nb} caractères"
  tooManyLineBreaks: Votre commentaire est limité à 8 sauts de lignes
  markdown: Format markdown supporté
en:
  send: Send
  message: type a comment {append}
  tooLong: " | Your comment is limited to 1 character | Your comment is limited to {nb} characters"
  tooManyLineBreaks: Your comment is limited to 8 line breaks
  markdown: Markdown supported
</i18n>

<script>
export default {
  props: {
    topic: { type: Object, default: null },
    editNote: { type: Object, required: false, default: null },
    appendPlaceholder: { type: String, required: false, default: null }
  },
  data () {
    return {
      valid: null,
      newNote: '',
      sending: false
    }
  },
  computed: {
    messageMaxLength () {
      console.log(process.env.messageMaxLength)

      return process.env.messageMaxLength || 200
    },
    disabled () {
      return !this.newNote || !this.valid || (this.editNote && this.editNote.content.trim() === this.newNote.trim())
    }
  },
  created () {
    if (this.editNote) this.newNote = this.editNote.content
  },
  methods: {
    // ctrl-enter to send
    handleEnter (e) {
      if (e.ctrlKey) this.sendNote()
    },
    // escape to cancel
    handleEsc () {
      this.$emit('cancel')
      this.newNote = ''
    },
    async sendNote () {
      if (this.disabled) return

      this.sending = true
      if (this.editNote) {
        const tmpNote = await this.$axios.$put(`api/v1/notes/${this.editNote._id}/content`, this.newNote, { headers: { 'Content-Type': 'text/plain' } })
        this.$set(this.editNote, 'editedAt', new Date().toISOString())
        this.$set(this.editNote, 'content', this.newNote)
        this.$set(this.editNote, 'user', tmpNote.user)
        this.$emit('sent', this.editNote)
      } else {
        const body = { topic: this.topic, content: this.newNote.trim() }
        const note = await this.$axios.$post('api/v1/notes', body)
        this.$emit('sent', note)
      }
      this.newNote = ''
      this.sending = false
    }
  }
}
</script>

<style>
.note-send .v-textarea {
  padding-right: 40px !important;
}
.note-send .v-input__append-outer {
  position: absolute;
  bottom: -4px;
  right: -2px;
}
</style>
