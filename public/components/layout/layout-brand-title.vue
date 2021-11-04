<template>
  <v-list-item class="pr-0">
    <v-list-item-avatar class="brand-logo">
      <img src="~/assets/logo.png">
    </v-list-item-avatar>
    <v-list-item-title v-if="!$vuetify.breakpoint.mobile">
      <h1 class="text-h5">
        @data-fair/social
      </h1>
    </v-list-item-title>
  </v-list-item>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['env'])
  }
}
</script>

<style lang="css">
.brand-logo.v-avatar {
  border-radius: 0;
  overflow: visible;
}
.brand-logo.v-avatar img {
  height: auto !important;
}
</style>
