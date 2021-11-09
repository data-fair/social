<template>
  <v-card flat>
    <v-card-title>
      <user-short :user="rating.user" />
      <div class="ml-1 mb-1">
        <div
          v-for="i in [1, 2, 3, 4, 5]"
          :key="i"
          style="display:inline;"
        >
          <v-icon :color="rating.score >= i ? 'accent' : 'default'">
            {{ rating.score >= i ? 'mdi-star' : 'mdi-star-outline' }}
          </v-icon>
        </div>
      </div>
    </v-card-title>
    <v-card-subtitle class="caption">
      {{ rating.createdAt | date }}
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
