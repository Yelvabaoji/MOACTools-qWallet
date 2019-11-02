<template>
  <q-page padding>
    <q-toolbar class="bg-white text-black">
      <q-btn flat dense round @click="$router.go(-1)"><q-icon name="keyboard_arrow_left" /></q-btn>
      <q-toolbar-title><strong> 设置</strong></q-toolbar-title>
    </q-toolbar>
    <q-separator color="grey-3" spaced />
    <h6 style="text-align: center; color: red">到现在为止没有什么需要设置的。</h6>
  </q-page>
</template>

<script>

export default {
  data () {
    return {
    }
  },
  mounted () {
    this.GLOBAL.showFooter = false
  },
  methods: {
  }
}
</script>

<style lang="stylus">
</style>
