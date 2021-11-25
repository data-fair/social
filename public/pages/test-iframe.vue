<template>
  <v-container>
    <v-iframe
      src="http://localhost:5608/embed/comments?key=test9&title=Test 5"
      style="border: 1px solid red;"
    />
  </v-container>
</template>

<script>
import 'iframe-resizer/js/iframeResizer'
import VIframe from '@koumoul/v-iframe'
export default {
  components: { VIframe }
}
</script>

<style>

</style>
