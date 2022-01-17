<template>
  <v-row class="note-send">
    <v-col>
      <v-form v-model="valid">
        <markdown-editor
          v-model="newNote"
          :append-placeholder="appendPlaceholder"
          :valid="valid"
          :edit-note="editNote"
          :sending="sending"
          style="min-height: 156px;"
          @send="sendNote"
          @handle-enter="handleEnter"
          @handle-escape="handleEsc"
        />
      </v-form>
    </v-col>
  </v-row>
</template>

<i18n lang="yaml">
fr:
  send: Envoyer
  tooLong: " | Votre commentaire est limité à 1 caractère | Votre commentaire est limité à {nb} caractères"
  tooManyLineBreaks: Votre commentaire est limité à 8 sauts de lignes
  markdown: Format markdown supporté
en:
  send: Send
  tooLong: " | Your comment is limited to 1 character | Your comment is limited to {nb} characters"
  tooManyLineBreaks: Your comment is limited to 8 line breaks
  markdown: Markdown supported
</i18n>

<script>
export default {
  components: {
    MarkdownEditor: () => import('@/components/util/markdown-editor.vue')
  },
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
      return process.env.messageMaxLength || 200
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
