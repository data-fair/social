<template>
  <v-card flat>
    <v-card-title>
      <div
        v-for="i in [1, 2, 3, 4, 5]"
        :key="i"
        style="display:inline;"
      >
        <v-icon :color="rating.score >= i ? 'accent' : 'default'">
          {{ rating.score >= i ? 'mdi-star' : 'mdi-star-outline' }}
        </v-icon>
      </div>
    </v-card-title>
    <v-card-subtitle>
      {{ rating.user.name }}
    </v-card-subtitle>
    <v-card-text>
      <pre style="white-space: pre-wrap">{{ rating.comment }}</pre>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    rating: { type: Object, required: true }
  }
}
</script>

<style>

</style>
