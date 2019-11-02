<template>
  <q-page class="q-pa-md">
    <q-toolbar-title class="q-mt-sm" style="text-align:center">
      <strong> 这里放DAPP List?  </strong>
    </q-toolbar-title>
    <q-separator color="grey-3" spaced />
  </q-page>
</template>

<script>

export default {
  data () {
    return {
    }
  },
  created () {
    this.GLOBAL.showFooter = true
  },
  mounted () {
    this.$forceUpdate()
  }
}
</script>

<style lang="stylus">
</style>
