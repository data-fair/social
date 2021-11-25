<template>
  <span
    class="text-body-2"
    :title="user.name"
  >
    <v-avatar :size="28">
      <img :src="`${env.directoryUrl}/api/avatars/user/${user.id}/avatar.png`">
    </v-avatar>
  </span>
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
