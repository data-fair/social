<template>
  <div style="display:inline;">
    <div
      v-for="i in [1, 2, 3, 4, 5]"
      :key="i"
      style="display:inline;"
    >
      <v-icon
        :color="value >= i ? 'accent' : 'default'"
        :title="$t('setScore', {i})"
        :style="{cursor: editable ? 'pointer' : 'default'}"
        @click="$emit('input', i)"
      >
        {{ value >= i ? 'mdi-star' : 'mdi-star-outline' }}
      </v-icon>
    </div>
  </div>
</template>

<i18n lang="yaml">
fr:
  setScore: Attribuer une note de {i}/5
en:
  setScore: Give a score of {i}/5
</i18n>

<script>
export default {
  props: {
    value: { type: Number, required: true },
    editable: { type: Boolean, default: true }
  }
}
</script>

<style>

</style>
