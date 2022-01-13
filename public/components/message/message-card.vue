<template>
  <div>
    <v-card
      flat
      :outlined="!message.responseTo"
    >
      <v-card-title class="py-1 px-1">
        <user-short :user="message.user" />
        <span
          class="caption text--secondary ml-2"
          :title="$dayjs(message.createdAt).format('LLL')"
        >{{ message.createdAt | fromNow }}</span>
        <span
          v-if="message.editedAt"
          class="text-caption text--secondary font-italic"
          :title="$dayjs(message.editedAt).format('LLL')"
        >&nbsp;({{ $t('editedAt', {date: $options.filters.fromNow(message.editedAt)}) }})</span>
        <v-spacer />
        <template v-if="canEdit">
          <v-btn
            v-if="!message.deletedAt && user.id === message.user.id"
            x-small
            icon
            :title="$t('edit')"
            @click="editing = true"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          &nbsp;
          <message-delete-menu
            v-if="!message.deletedAt"
            :message="message"
          />
        </template>
      </v-card-title>
      <v-card-text class="px-2 py-0">
        <span
          v-if="message.moderatedBy && message.deletedAt"
          class="text-caption font-italic"
          :title="$dayjs(message.deletedAt).format('LLL')"
        >{{ $t('deletedAtModerated', {moderator: message.moderatedBy.name || message.moderatedBy.id, date: $options.filters.fromNow(message.deletedAt)}) }}</span>
        <span
          v-else-if="message.deletedAt"
          class="text-caption font-italic"
          :title="$dayjs(message.deletedAt).format('LLL')"
        >{{ $t('deletedAt', {date: $options.filters.fromNow(message.deletedAt)}) }}</span>
        <message-send
          v-else-if="editing"
          :edit-message="message"
          @sent="editing = false"
          @cancel="editing = false"
        />
        <pre
          v-else
          style="white-space: pre-wrap"
          class="text-body-2"
        >{{ message.content }}</pre>
      </v-card-text>
      <v-card-actions
        v-if="!message.responseTo && !message.deletedAt"
        class="px-1 pt-0 pb-1"
      >
        <v-btn
          x-small
          text
          :title="$t('respond')"
          color="primary"
          @click="responding=!responding"
        >
          {{ $t('respond') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <message-list-topic
      v-if="!message.responseTo"
      :topic="message.topic"
      :response-to="message"
      :hide-send="!responding"
      :reverse="true"
      class="pa-1 pb-2 ml-4 pr-8 mb-2"
      @sent-response="responding = false"
    />
    <!--
      WARNING this element is required to make iframe-resizer work, it is broken by autofocus in iframe apparently
      use /test-frame page to check that everything is ok
    -->
    <span
      v-if="!message.responseTo && last"
      style="font-size: 1px;"
    >&nbsp;</span>
  </div>
</template>

<i18n lang="yaml">
fr:
  respond: Répondre
  edit: Éditer le message
  delete: Supprimer le message
  deletedAt: message supprimé {date}
  deletedAtModerated: message supprimé par l'administrateur {moderator} {date}
  editedAt: édité {date}
en:
  respond: Respond
  edit: Edit the message
  delete: Delete the message
  deletedAt: deleted {date}
  deletedAtModerated: deleted by the admin {moderator} {date}
  editedAt: edited {date}
</i18n>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    message: { type: Object, required: true },
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
      if (!this.user) return false
      if (this.user.organization?.role === 'admin' && this.message.owner.id === this.user.organization.id) {
        return true
      }
      return this.user.id === this.message.user.id
    }
  }
}
</script>

<style>

</style>
