<template>
  <v-input
    :value="value"
    :rules="[v => v.length <= messageMaxLength || $tc('tooLong', messageMaxLength, { nb: messageMaxLength }), v => v.split('\n').length <= 9 || $t('tooManyLineBreaks') ]"
    :disabled="disabled"
    hide-details="auto"
    class="markdown-editor"
    :style="(editNote ? 'margin-bottom: 5px;' : '') + (easymde ? '' : 'visibility: hidden;')"
    @keydown.esc.native="editNote && $emit('handle-escape', $event)"
    @keydown.enter.native="!disabledSend && $emit('handle-enter', $event)"
  >
    <v-card
      v-if="!disabled"
      :outlined="!editNote"
      elevation="0"
    >
      <textarea :placeholder="$t('message', {append: appendPlaceholder})" />
      <v-btn
        small
        color="primary"
        absolute
        style="right: 8px; bottom: 8px;"
        bottom
        right
        :disabled="disabledSend"
        icon
        :title="$t('send')"
        :loading="sending"
        @click="$emit('send')"
      >
        <v-icon v-if="editNote">
          mdi-pencil
        </v-icon>
        <v-icon v-else>
          mdi-send
        </v-icon>
      </v-btn>
    </v-card>
    <v-card
      v-else
      outlined
    >
      <v-card-text
        class="pb-0"
        v-html="markdownContent"
      />
    </v-card>
  </v-input>
</template>

<i18n lang="yaml">
fr:
  send: Envoyer
  message: saisissez un commentaire {append}
  linkBefore: "[titre du lien"
  linkAfter: "](adresse du lien)"
  imageHref: adresse de l'image
  column: Colonne
  text: Texte
  bold: Gras
  italic: Italique
  heading: Titre
  quote: Citation
  unorderedList: Liste à puce
  orderedList: Liste numérotée
  createLink: Créer un lien
  insertImage: Insérer une image
  insertTable: Insérer un tableau
  preview: Aperçu du rendu
  syntaxDoc: Documentation de la syntaxe
  tooLong: " | Votre commentaire est limité à 1 caractère | Votre commentaire est limité à {nb} caractères"
  tooManyLineBreaks: Votre commentaire est limité à 8 sauts de lignes
en:
  send: Send
  message: type a comment {append}
  linkBefore: "[link title"
  linkAfter: "](link url)"
  imageHref: image url
  column: Column
  text: Text
  bold: Bold
  italic: Italic
  heading: Heading
  quote: Quote
  unorderedList: Unordered list
  orderedList: Ordered list
  createLink: Create a link
  insertImage: Insert an image
  insertTable: Insert a table
  preview: Preview
  syntaxDoc: Syntax documentation
  tooLong: " | Your comment is limited to 1 character | Your comment is limited to {nb} characters"
  tooManyLineBreaks: Your comment is limited to 8 line breaks
</i18n>

<script>
import 'easymde/dist/easymde.min.css'
const { marked, renderer } = require('../util/marked')

const sanitizeHtml = require('sanitize-html')

export default {
  props: {
    value: { type: String, default: '' },
    appendPlaceholder: { type: String, required: false, default: null },
    valid: { type: Boolean, default: false },
    editNote: { type: Object, default: () => {} },
    sending: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },
  data () {
    return {
      easymde: null
    }
  },
  computed: {
    disabledSend () {
      return !this.value || !this.valid || ((this.editNote?.content || '').trim() === this.value?.trim())
    },
    messageMaxLength () {
      return process.env.messageMaxLength || 200
    },
    markdownContent () {
      const allowedTags = sanitizeHtml.defaults.allowedTags.filter(v => v !== 'h1')
      return sanitizeHtml(marked.parse(this.value, { renderer, breaks: true }), { allowedTags })
    }
  },
  watch: {
    value () {
      if (this.value === '') this.easymde.value('')
    }
  },
  async mounted () {
    if (this.disabled) return
    const EasyMDE = (await import('easymde/src/js/easymde.js')).default

    // cf https://github.com/Ionaru/easy-markdown-editor#configuration
    const config = {
      element: this.$el.querySelector('textarea'),
      theme: 'dark',
      initialValue: this.value,
      renderingConfig: {},
      status: false,
      autoDownloadFontAwesome: false,
      spellChecker: false,
      minHeight: '100px',
      maxHeight: '100px',
      insertTexts: {
        link: [this.$t('linkBefore'), this.$t('linkAfter')],
        table: ['', `\n\n| ${this.$t('column')} 1 | ${this.$t('column')} 2 | ${this.$t('column')} 3 |\n| -------- | -------- | -------- |\n| ${this.$t('text')}     | ${this.$t('text')}     | ${this.$t('text')}     |\n\n`],
        horizontalRule: ['', '\n\n-----\n\n']
      },
      previewClass: ['text-body-2', 'custom-markdown', 'custom-preview'],
      // cf https://github.com/Ionaru/easy-markdown-editor/blob/master/src/js/easymde.js#L1380
      toolbar: [{
        name: 'bold',
        action: EasyMDE.toggleBold,
        // className: 'fa fa-bold',
        className: 'mdi mdi-format-bold',
        title: this.$t('bold')
      }, {
        name: 'italic',
        action: EasyMDE.toggleItalic,
        className: 'mdi mdi-format-italic',
        title: this.$t('italic')
      }, {
        // starting at heading 2.. h1 is reserved to the wrapping page
        name: 'heading-2',
        action: EasyMDE.toggleHeading2,
        className: 'mdi mdi-format-title',
        title: this.$t('heading') + ' 1'
      }, {
        name: 'heading-3',
        action: EasyMDE.toggleHeading3,
        className: 'mdi mdi-format-title',
        title: this.$t('heading') + ' 2'
      },
      '|',
      {
        name: 'quote',
        action: EasyMDE.toggleBlockquote,
        className: 'mdi mdi-format-quote-open',
        title: this.$t('quote')
      },
      {
        name: 'unordered-list',
        action: EasyMDE.toggleUnorderedList,
        className: 'mdi mdi-format-list-bulleted',
        title: this.$t('unorderedList')
      },
      {
        name: 'ordered-list',
        action: EasyMDE.toggleOrderedList,
        className: 'mdi mdi-format-list-numbered',
        title: this.$t('orderedList')
      },
      '|',
      {
        name: 'link',
        action: EasyMDE.drawLink,
        className: 'mdi mdi-link',
        title: this.$t('createLink')
      },
      {
        name: 'table',
        action: EasyMDE.drawTable,
        className: 'mdi mdi-table',
        title: this.$t('insertTable')
      },
      '|',
      {
        name: 'preview',
        action: EasyMDE.togglePreview,
        className: 'mdi mdi-eye accent--text',
        title: this.$t('preview'),
        noDisable: true
      },
      '|',
      {
        name: 'guide',
        action: 'https://simplemde.com/markdown-guide',
        className: 'mdi mdi-help-circle success--text',
        title: this.$t('syntaxDoc'),
        noDisable: true
      }
      ]
    }
    this.easymde = new EasyMDE(config)

    this.easymde.codemirror.on('change', () => {
      this.$emit('input', this.easymde.value())
    })
  }
}
</script>

<style lang="css">
/* lighter style, a v-card is used for the border */
.markdown-editor .v-input__slot {
  display: block;
}
.markdown-editor .EasyMDEContainer .editor-toolbar {
  border: none;
  padding: 2px;
}
.markdown-editor .EasyMDEContainer .CodeMirror {
  border: none;
  background-color: #F0F0F0;
}

/* dark mode, cf https://github.com/Ionaru/easy-markdown-editor/issues/131 */
.markdown-editor.theme--dark .CodeMirror {
  color: white;
  background-color: #303030;
}
.markdown-editor.theme--dark .CodeMirror-cursor {
  border-left-color: white;
  border-right-color: white;
}
.markdown-editor.theme--dark .editor-toolbar > .active, .markdown-editor.theme--dark .editor-toolbar > button:hover, .markdown-editor.theme--dark .editor-preview pre, .markdown-editor.theme--dark .cm-s-easymde .cm-comment {
  background-color: #303030;
}
.markdown-editor.theme--dark .editor-preview {
  background-color: #1E1E1E;
}
.custom-markdown > p {
  margin-bottom: 0;
}

.custom-preview {
  padding: 10px;
  background: #fafafa;
  white-space: pre-wrap;
  line-height: 1rem;
}

.custom-preview > p {
  margin-top: 0;
  margin-bottom: 0;
}

.custom-preview pre {
  background: #eee;
  margin-bottom: 10px;
}
.custom-preview table td,
.custom-preview table th {
  border: 1px solid #ddd;
  padding: 5px;
}
</style>
