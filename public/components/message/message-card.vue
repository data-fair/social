<template>
  <v-card
    flat
    outlined
  >
    <v-card-title>
      <user-short :user="message.user" />
      <v-spacer />
      <span class="caption">{{ message.createdAt | date }}</span>
    </v-card-title>
    <v-card-text>
      <pre style="white-space: pre-wrap">{{ message.content }}</pre>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    message: { type: Object, required: true }
  }
}
</script>

<style>

</style>
