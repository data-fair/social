<template>
  <v-form v-model="valid">
    <v-textarea
      v-model="comment"
      hide-details="auto"
      :rows="1"
      auto-grow
      dense
      outlined
      :placeholder="$t('comment')"
      :rules="[value => value.length <= 200 || $t('tooLong'), value => value.split('\n').length <= 9 || $t('tooManyLineBreaks') ]"
      @keydown.enter="handleEnter"
    >
      <template #append-outer>
        <v-btn
          :fab="!disabled"
          :small="!disabled"
          color="primary"
          bottom
          :disabled="disabled"
          :icon="disabled"
          :title="$t('send')"
          :loading="sending"
          @click="$emit('input', comment)"
        >
          <v-icon>
            mdi-send
          </v-icon>
        </v-btn>
      </template>
    </v-textarea>
  </v-form>
</template>

<i18n lang="yaml">
fr:
  comment: ajoutez un commentaire à votre évaluation
  tooLong: Votre commentaire est limité à 200 caractères
  tooManyLineBreaks: Votre message est limité à 8 sauts de lignes
en:
  comment: add a comment to your rating
  tooLong: Your comment is limited to 200 characters
  tooManyLineBreaks: Your message is limited to 8 line breaks
</i18n>

<script>
export default {
  props: {
    value: { type: String, default: '' },
    sending: { type: Boolean, default: false }
  },
  data () {
    return {
      valid: null,
      comment: ''
    }
  },
  computed: {
    disabled () {
      return !this.valid || this.comment.trim() === this.value.trim()
    }
  },
  created () {
    this.comment = this.value
  },
  methods: {
    // ctr-enter to save comment
    handleEnter (e) {
      if (e.ctrlKey && !this.disabled) this.$emit('input', this.comment.trim())
    }
  }
}
</script>

<style>

</style>
