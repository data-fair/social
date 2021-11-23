<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    min-width="300px"
  >
    <template #activator="{on, attrs}">
      <v-btn
        x-small
        icon
        :title="$t('delete')"
        color="warning"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        {{ $t('delete') }}
      </v-card-title>
      <v-card-text>
        {{ $t('confirmDelete') }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          :disabled="loading"
          @click="menu = false"
        >
          {{ $t('no') }}
        </v-btn>
        <v-btn
          color="warning"
          :loading="loading"
          @click="deleteContent"
        >
          {{ $t('oui') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<i18n lang="yaml">
fr:
  delete: Supprimer le message
  confirmDelete: Souhaitez vous confirmer la suppression ?
  yes: oui
  no: non
en:
  delete: Delete the message
  confirmDelete: Do you want to confirm the deletion ?
  yes: yes
  no: no
</i18n>

<script>
export default {
  props: {
    message: { type: Object, required: true }
  },
  data () {
    return { menu: false, loading: false }
  },
  methods: {
    async deleteContent () {
      this.loading = true
      await this.$axios.$delete(`api/v1/messages/${this.message._id}/content`)
      this.$set(this.message, 'deletedAt', new Date().toISOString())
      this.$set(this.message, 'content', '')
      this.loading = false
      this.menu = false
    }
  }
}
</script>

<style>

</style>
