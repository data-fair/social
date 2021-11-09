<template>
  <message-list :topic="topic" />
</template>

<script>
export default {
  layout: 'embed',
  data () {
    return {
      topic: null
    }
  },
  created () {
    if (!this.$route.query.key) throw new Error('query parameter "key" is required')
    if (!this.$route.query.title) throw new Error('query parameter "title" is required')
    this.topic = { key: this.$route.query.key, title: this.$route.query.title }
  }
}
</script>

<style>

</style>
