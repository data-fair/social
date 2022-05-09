<template>
  <div>
    <v-card
      flat
      outlined
    >
      <v-card-title class="py-1 px-1">
        <user-short :user="note.user" />
        <span
          class="caption text--secondary ml-2"
          :title="$dayjs(note.createdAt).format('LLL')"
        >{{ note.createdAt | fromNow }}</span>
        <span
          v-if="note.editedAt"
          class="text-caption text--secondary font-italic"
          :title="$dayjs(note.editedAt).format('LLL')"
        >&nbsp;({{ $t('editedAt', {date: $options.filters.fromNow(note.editedAt)}) }})</span>
        <v-spacer />
        <template v-if="canEdit">
          <v-btn
            v-show="!editing"
            x-small
            icon
            :title="$t('edit')"
            @click="editing = true"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          &nbsp;
          <note-delete-menu
            :note="note"
            @delete="$emit('delete', $event)"
          />
        </template>
      </v-card-title>
      <v-card-text class="px-2 py-0">
        <note-send
          v-if="editing"
          :edit-note="note"
          @sent="editing = false"
          @cancel="editing = false"
        />
        <pre
          v-else
          style="white-space: pre-wrap; line-height: 1rem;"
          class="text-body-2 custom-markdown"
          v-html="markdown(note.content || '')"
        />
      </v-card-text>
    </v-card>
    <!--
      WARNING this element is required to make iframe-resizer work, it is broken by autofocus in iframe apparently
      use /test-frame page to check that everything is ok
    -->
    <span
      v-if="last"
      style="font-size: 1px;"
    >&nbsp;</span>
  </div>
</template>

<i18n lang="yaml">
fr:
  edit: Éditer le commentaire
  delete: Supprimer le commentaire
  editedAt: édité {date}
en:
  edit: Edit the comment
  delete: Delete the comment
  editedAt: edited {date}
</i18n>

<script>
import { mapState } from 'vuex'

const { marked, renderer } = require('../util/marked')
const sanitize = require('sanitize-html')

export default {
  props: {
    note: { type: Object, required: true },
    last: { type: Boolean, default: false }
  },
  data () {
    return {
      responding: false,
      editing: false
    }
  },
  computed: {
    ...mapState('session', ['user']),
    canEdit () {
      return this.user && (this.user.adminMode || (this.user.organization && this.user.organization.id === this.note.owner.id) || (this.user.id === this.note.user.id))
    }
  },
  methods: {
    markdown (content) {
      const allowedTags = sanitize.defaults.allowedTags.filter(v => v !== 'h1')
      return sanitize(marked.parse(content, { renderer, breaks: true }), { allowedTags })
    }
  }
}
</script>

<style>
.custom-markdown > p {
  margin-bottom: 0;
}
.custom-markdown table td,
.custom-markdown table th {
  border: 1px solid #ddd;
  padding: 5px;
}
</style>
