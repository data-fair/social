<template>
  <v-tooltip top>
    <template #activator="{on}">
      <span
        class="text-body-2"
        v-on="on"
      >
        <v-avatar :size="28">
          <img :src="`${env.directoryUrl}/api/avatars/user/${user.id}/avatar.png`">
        </v-avatar>
      </span>
    </template>
    {{ user.name }}
  </v-tooltip>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    user: { type: Object, required: true }
  },
  computed: {
    ...mapState(['env'])
  }
}
</script>

<style lang="css" scoped>
</style>
