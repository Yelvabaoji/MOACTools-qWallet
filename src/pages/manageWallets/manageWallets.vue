<template>
  <q-page class="q-pa-md">
    <q-toolbar class="bg-white text-black">
      <q-btn flat dense round @click="$router.go(-1)"><q-icon name="keyboard_arrow_left" /></q-btn>
      <q-toolbar-title><strong> 管理钱包</strong></q-toolbar-title>
    </q-toolbar>

    <q-separator color="grey-3" spaced />

    <q-list >
        <q-item clickable v-ripple to="/createWallet">
          <q-item-section avatar><q-icon color="orange" size="32px" name="account_balance_wallet" /></q-item-section>
          <q-item-section>创建新钱包</q-item-section>
          <q-item-section side><q-icon name="keyboard_arrow_right" /></q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/deleteWallet">
          <q-item-section avatar><q-icon color="orange" size="32px" name="account_balance_wallet" /></q-item-section>
          <q-item-section>删除钱包</q-item-section>
          <q-item-section side><q-icon name="keyboard_arrow_right" /></q-item-section>
        </q-item>

        <q-separator color="grey-3" spaced />

        <q-item clickable v-ripple to="/fromPrivateKey">
          <q-item-section avatar><q-icon color="green" size="32px" name="vpn_key" /></q-item-section>
          <q-item-section>从私钥导入钱包</q-item-section>
          <q-item-section side><q-icon name="keyboard_arrow_right" /></q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/fromKeystore">
          <q-item-section avatar><q-icon color="green" size="32px" name="lock_open" /></q-item-section>
          <q-item-section>从keystore导入钱包</q-item-section>
          <q-item-section side><q-icon name="keyboard_arrow_right" /></q-item-section>
        </q-item>

        <q-separator color="grey-3" spaced />

        <q-item clickable v-ripple to="/backupPrivateKey">
          <q-item-section avatar><q-icon color="blue" size="32px" name="vpn_key" /></q-item-section>
          <q-item-section>导出私钥</q-item-section>
          <q-item-section side><q-icon name="keyboard_arrow_right" /></q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/backupKeystore">
          <q-item-section avatar><q-icon color="blue" size="32px" name="lock" /></q-item-section>
          <q-item-section>导出keystore</q-item-section>
          <q-item-section side><q-icon name="keyboard_arrow_right" /></q-item-section>
        </q-item>
    </q-list>
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
