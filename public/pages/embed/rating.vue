<template>
  <v-container
    fluid
    data-iframe-height
  >
    <rating-edit
      v-if="topic"
      :topic="topic"
    />
  </v-container>
</template>

<script>
export default {
  layout: 'embed',
  data () {
    return { topic: null }
  },
  mounted () {
    if (!this.$route.query.key) throw new Error('query parameter "key" is required')
    if (!this.$route.query.title) throw new Error('query parameter "title" is required')
    this.topic = { key: this.$route.query.key, title: this.$route.query.title }
  }
}
</script>
